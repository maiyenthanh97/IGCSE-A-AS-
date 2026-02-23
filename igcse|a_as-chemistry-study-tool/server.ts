import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // Zalo OAuth Config
  const ZALO_APP_ID = process.env.ZALO_APP_ID;
  const ZALO_APP_SECRET = process.env.ZALO_APP_SECRET;
  const APP_URL = process.env.APP_URL || "http://localhost:3000";
  const REDIRECT_URI = `${APP_URL}/auth/zalo/callback`;

  // API Routes
  app.get("/api/auth/zalo/url", (req, res) => {
    if (!ZALO_APP_ID) {
      return res.status(500).json({ error: "ZALO_APP_ID not configured" });
    }
    const state = Math.random().toString(36).substring(7);
    const authUrl = `https://oauth.zaloapp.com/v4/permission?app_id=${ZALO_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}`;
    res.json({ url: authUrl });
  });

  app.get("/auth/zalo/callback", async (req, res) => {
    const { code } = req.query;

    if (!code) {
      return res.send("No code provided");
    }

    try {
      // Exchange code for access token
      const tokenResponse = await axios.post(
        "https://oauth.zaloapp.com/v4/access_token",
        new URLSearchParams({
          code: code as string,
          app_id: ZALO_APP_ID!,
          grant_type: "authorization_code",
          code_verifier: "", // Only if PKCE is used
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            secret_key: ZALO_APP_SECRET!,
          },
        }
      );

      const { access_token } = tokenResponse.data;

      // Get user info
      const userResponse = await axios.get(
        "https://graph.zaloapp.com/v2.0/me?fields=id,name,picture",
        {
          headers: { access_token },
        }
      );

      const userData = userResponse.data;

      // Set cookie for session
      res.cookie("zalo_user", JSON.stringify(userData), {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'ZALO_AUTH_SUCCESS', user: ${JSON.stringify(userData)} }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (error: any) {
      console.error("Zalo Auth Error:", error.response?.data || error.message);
      res.status(500).send("Authentication failed");
    }
  });

  app.get("/api/user", (req, res) => {
    const userCookie = req.cookies.zalo_user;
    if (userCookie) {
      res.json(JSON.parse(userCookie));
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  app.post("/api/logout", (req, res) => {
    res.clearCookie("zalo_user", {
      secure: true,
      sameSite: "none",
    });
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
