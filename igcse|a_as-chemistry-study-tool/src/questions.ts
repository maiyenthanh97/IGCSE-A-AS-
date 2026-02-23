export interface Question {
  id: number;
  chapter: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
}

export const questions: Question[] = [
  {
    id: 1,
    chapter: 1,
    topic: "Subatomic particles",
    question: "What is the relative mass of an electron compared to a proton?",
    options: ["1", "1/1836", "1/200", "0"],
    correctAnswer: 1,
    explanation: "The mass of an electron is approximately 1/1836 of the mass of a proton."
  },
  {
    id: 2,
    chapter: 1,
    topic: "Atomic number (Z)",
    question: "If an atom has an atomic number (Z) of 11, how many protons does it have?",
    options: ["11", "23", "12", "1"],
    correctAnswer: 0,
    explanation: "Atomic number (Z) is defined as the number of protons in the nucleus."
  },
  {
    id: 3,
    chapter: 1,
    topic: "Mass number (A)",
    question: "An atom has A = 23 and Z = 11. How many neutrons does it contain?",
    options: ["11", "23", "12", "34"],
    correctAnswer: 2,
    explanation: "Neutrons = Mass number (A) - Atomic number (Z) = 23 - 11 = 12."
  },
  {
    id: 4,
    chapter: 1,
    topic: "Isotopes",
    question: "What defines isotopes of the same element?",
    options: [
      "Same protons, same neutrons",
      "Different protons, same neutrons",
      "Same protons, different neutrons",
      "Different protons, different neutrons"
    ],
    correctAnswer: 2,
    explanation: "Isotopes have the same number of protons (same element) but different numbers of neutrons."
  },
  {
    id: 5,
    chapter: 1,
    topic: "Ion formation",
    question: "When an atom loses an electron, what type of ion is formed?",
    options: ["Negative ion", "Positive ion", "Neutral atom", "Isotope"],
    correctAnswer: 1,
    explanation: "Losing a negative electron leaves the atom with more positive protons than negative electrons, forming a positive ion."
  },
  {
    id: 6,
    chapter: 1,
    topic: "Ionisation Energy",
    question: "Which state of matter is required in the definition of First Ionisation Energy?",
    options: ["Solid (s)", "Liquid (l)", "Gaseous (g)", "Aqueous (aq)"],
    correctAnswer: 2,
    explanation: "First Ionisation Energy is the energy required to remove 1 mole of electrons from 1 mole of gaseous atoms."
  },
  {
    id: 7,
    chapter: 1,
    topic: "Electronic configuration",
    question: "Which orbital is filled after 3p according to the increasing energy order?",
    options: ["3d", "4s", "4p", "4d"],
    correctAnswer: 1,
    explanation: "The order of filling is 1s 2s 2p 3s 3p 4s 3d... 4s is filled before 3d because it has lower energy."
  },
  {
    id: 8,
    chapter: 1,
    topic: "Transition metals",
    question: "When Iron (Fe: [Ar] 4s² 3d⁶) forms an Fe²⁺ ion, which electrons are removed first?",
    options: ["3d electrons", "4s electrons", "1s electrons", "2p electrons"],
    correctAnswer: 1,
    explanation: "For transition metals, electrons are removed from the highest energy level (outermost shell) first, which is 4s."
  },
  {
    id: 9,
    chapter: 1,
    topic: "IE Trends",
    question: "How does First Ionisation Energy generally change across a period (left to right)?",
    options: ["Decreases", "Increases", "Stays the same", "Fluctuates randomly"],
    correctAnswer: 1,
    explanation: "Across a period, nuclear charge increases and atomic radius decreases, making it harder to remove an electron."
  },
  {
    id: 10,
    chapter: 1,
    topic: "Group Trends",
    question: "A Group 2 element (e.g., Magnesium) will typically form an ion with what charge?",
    options: ["+1", "+2", "-1", "-2"],
    correctAnswer: 1,
    explanation: "Group 2 elements have 2 valence electrons and lose them to achieve a stable noble gas configuration, forming +2 ions."
  },
  {
    id: 11,
    chapter: 1,
    topic: "Group Trends",
    question: "Why does First Ionisation Energy decrease down a group?",
    options: [
      "Nuclear charge decreases",
      "Atomic radius decreases",
      "Shielding increases and distance from nucleus increases",
      "Number of protons increases"
    ],
    correctAnswer: 2,
    explanation: "Down a group, more shells are added, increasing shielding and distance, making the outer electron easier to remove."
  },
  {
    id: 12,
    chapter: 1,
    topic: "Ion formation",
    question: "Chlorine (Group 7) has 17 protons and 17 electrons. After gaining 1 electron, what is its net charge?",
    options: ["+1", "0", "-1", "-7"],
    correctAnswer: 2,
    explanation: "17 protons (+) and 18 electrons (-) results in a net charge of -1."
  },
  {
    id: 13,
    chapter: 1,
    topic: "Electronic configuration",
    question: "What is the electronic configuration of a Calcium ion (Ca²⁺)?",
    options: ["2, 8, 8, 2", "2, 8, 8", "2, 8, 10", "2, 8, 8, 4"],
    correctAnswer: 1,
    explanation: "Calcium (Z=20) has configuration 2,8,8,2. Losing 2 electrons gives 2,8,8."
  },
  {
    id: 14,
    chapter: 1,
    topic: "Subatomic particles",
    question: "Which subatomic particle has a relative charge of +1?",
    options: ["Electron", "Neutron", "Proton", "Positron"],
    correctAnswer: 2,
    explanation: "Protons have a relative charge of +1, neutrons are neutral (0), and electrons are -1."
  },
  {
    id: 15,
    chapter: 1,
    topic: "Isotopes",
    question: "Carbon-12 and Carbon-14 are isotopes. What is the difference between them?",
    options: ["Number of protons", "Number of electrons", "Number of neutrons", "Atomic number"],
    correctAnswer: 2,
    explanation: "Isotopes of the same element have the same number of protons but different numbers of neutrons (12-6=6 vs 14-6=8)."
  },
  {
    id: 16,
    chapter: 1,
    topic: "Relative atomic mass",
    question: "If an element has two isotopes: 75% of mass 35 and 25% of mass 37, what is its Ar?",
    options: ["35.0", "36.0", "35.5", "37.0"],
    correctAnswer: 2,
    explanation: "Ar = (35 * 0.75) + (37 * 0.25) = 26.25 + 9.25 = 35.5."
  },
  {
    id: 17,
    chapter: 1,
    topic: "Ionisation Energy",
    question: "Which equation represents the second ionisation energy of Magnesium?",
    options: [
      "Mg(g) → Mg²⁺(g) + 2e⁻",
      "Mg⁺(g) → Mg²⁺(g) + e⁻",
      "Mg(s) → Mg²⁺(g) + 2e⁻",
      "Mg⁺(s) → Mg²⁺(g) + e⁻"
    ],
    correctAnswer: 1,
    explanation: "Second IE is the energy to remove the second electron from a 1+ gaseous ion."
  },
  {
    id: 18,
    chapter: 1,
    topic: "Electronic configuration",
    question: "How many electrons can a 'p' subshell hold at maximum?",
    options: ["2", "6", "10", "14"],
    correctAnswer: 1,
    explanation: "An 's' subshell holds 2, 'p' holds 6, 'd' holds 10, and 'f' holds 14."
  },
  {
    id: 19,
    chapter: 1,
    topic: "IE Trends",
    question: "Why is there a slight decrease in IE between Nitrogen and Oxygen?",
    options: [
      "Oxygen has a smaller radius",
      "Oxygen has more protons",
      "Electron-electron repulsion in the paired 2p orbital of Oxygen",
      "Nitrogen has more shielding"
    ],
    correctAnswer: 2,
    explanation: "In Oxygen, the fourth 2p electron is paired, leading to repulsion which makes it easier to remove."
  },
  {
    id: 20,
    chapter: 1,
    topic: "IE Trends",
    question: "Why is the first IE of Boron lower than Beryllium?",
    options: [
      "Boron has more protons",
      "Boron's outer electron is in a 2p orbital, which is higher in energy and shielded by 2s",
      "Beryllium has a larger radius",
      "Boron is a non-metal"
    ],
    correctAnswer: 1,
    explanation: "Boron's 2p electron is further from the nucleus and shielded by the 2s subshell."
  },
  {
    id: 21,
    chapter: 1,
    topic: "Subatomic particles",
    question: "Where is most of the mass of an atom concentrated?",
    options: ["In the electron shells", "In the nucleus", "Evenly distributed", "In the empty space"],
    correctAnswer: 1,
    explanation: "The nucleus contains protons and neutrons, which are much heavier than electrons."
  },
  {
    id: 22,
    chapter: 1,
    topic: "Atomic number (Z)",
    question: "What determines the chemical identity of an element?",
    options: ["Number of neutrons", "Number of protons", "Number of valence electrons", "Mass number"],
    correctAnswer: 1,
    explanation: "The number of protons (atomic number) uniquely identifies an element."
  },
  {
    id: 23,
    chapter: 1,
    topic: "Electronic configuration",
    question: "What is the configuration of Chromium (Z=24)?",
    options: ["[Ar] 4s² 3d⁴", "[Ar] 4s¹ 3d⁵", "[Ar] 4s² 3d⁵", "[Ar] 3d⁶"],
    correctAnswer: 1,
    explanation: "Chromium is an exception; it has a half-filled 4s and 3d subshell for extra stability."
  },
  {
    id: 24,
    chapter: 1,
    topic: "Electronic configuration",
    question: "What is the configuration of Copper (Z=29)?",
    options: ["[Ar] 4s² 3d⁹", "[Ar] 4s¹ 3d¹⁰", "[Ar] 4s² 3d¹⁰", "[Ar] 3d⁹"],
    correctAnswer: 1,
    explanation: "Copper is an exception; it has a full 3d subshell and half-filled 4s subshell for stability."
  },
  {
    id: 25,
    chapter: 1,
    topic: "Ion formation",
    question: "Which group of elements is most likely to form -2 ions?",
    options: ["Group 2", "Group 6", "Group 7", "Group 0"],
    correctAnswer: 1,
    explanation: "Group 6 elements have 6 valence electrons and need 2 more to complete their octet."
  },
  {
    id: 26,
    chapter: 1,
    topic: "Ionisation Energy",
    question: "Successive ionisation energies of an element are: 578, 1817, 2745, 11577, 14842. Which group is it in?",
    options: ["Group 1", "Group 2", "Group 3", "Group 4"],
    correctAnswer: 2,
    explanation: "The large jump is between the 3rd and 4th IE, indicating 3 valence electrons."
  },
  {
    id: 27,
    chapter: 1,
    topic: "Subatomic particles",
    question: "What is the relative charge of an alpha particle?",
    options: ["+1", "+2", "0", "-1"],
    correctAnswer: 1,
    explanation: "An alpha particle is a Helium nucleus (2 protons, 2 neutrons), so its charge is +2."
  },
  {
    id: 28,
    chapter: 1,
    topic: "Isotopes",
    question: "Do isotopes of an element have the same chemical properties?",
    options: ["Yes, because they have the same electron configuration", "No, because they have different masses", "Yes, because they have the same neutrons", "No, because they have different protons"],
    correctAnswer: 0,
    explanation: "Chemical properties depend on the number and arrangement of electrons, which are the same for isotopes."
  },
  {
    id: 29,
    chapter: 1,
    topic: "Relative atomic mass",
    question: "The Ar of Neon is 20.2. It has isotopes 20Ne and 22Ne. Which is more abundant?",
    options: ["20Ne", "22Ne", "They are equal", "Cannot be determined"],
    correctAnswer: 0,
    explanation: "Since 20.2 is closer to 20 than 22, 20Ne must be more abundant (approx 90%)."
  },
  {
    id: 30,
    chapter: 1,
    topic: "Ionisation Energy",
    question: "Which factor does NOT affect ionisation energy?",
    options: ["Nuclear charge", "Atomic radius", "Shielding", "Number of neutrons"],
    correctAnswer: 3,
    explanation: "Neutrons are in the nucleus and do not significantly affect the attraction between the nucleus and electrons."
  },
  {
    id: 31,
    chapter: 2,
    topic: "Mole Concept",
    question: "How many particles are in 1 mole of a substance?",
    options: ["6.02 x 10^22", "6.02 x 10^23", "1.66 x 10^-24", "12.0"],
    correctAnswer: 1,
    explanation: "1 mole is defined as 6.02 x 10^23 particles (Avogadro's constant)."
  },
  {
    id: 32,
    chapter: 2,
    topic: "Basic Formula",
    question: "What is the number of moles in 18g of water (H2O)? (Ar: H=1, O=16)",
    options: ["0.5 mol", "1.0 mol", "2.0 mol", "18 mol"],
    correctAnswer: 1,
    explanation: "n = m / Mr. Mr(H2O) = 2(1) + 16 = 18. n = 18 / 18 = 1.0 mol."
  },
  {
    id: 33,
    chapter: 2,
    topic: "Gas at r.t.p",
    question: "What volume does 2 moles of Oxygen gas occupy at r.t.p?",
    options: ["24 dm3", "48 dm3", "22.4 dm3", "12 dm3"],
    correctAnswer: 1,
    explanation: "At r.t.p, 1 mole of any gas occupies 24 dm3. 2 moles occupy 2 * 24 = 48 dm3."
  },
  {
    id: 34,
    chapter: 2,
    topic: "Concentration",
    question: "What is the concentration of a solution containing 0.5 mol of solute in 250 cm3 of solvent?",
    options: ["0.002 mol dm-3", "2.0 mol dm-3", "0.5 mol dm-3", "1.25 mol dm-3"],
    correctAnswer: 1,
    explanation: "c = n / V. V = 250 cm3 = 0.25 dm3. c = 0.5 / 0.25 = 2.0 mol dm-3."
  },
  {
    id: 35,
    chapter: 2,
    topic: "Limiting Reagent",
    question: "In the reaction 2H2 + O2 -> 2H2O, if you have 5 mol of H2 and 2 mol of O2, which is the limiting reagent?",
    options: ["H2", "O2", "H2O", "Neither"],
    correctAnswer: 1,
    explanation: "Ratio H2:O2 is 2:1. 2 mol O2 needs 4 mol H2. Since we have 5 mol H2, O2 is limiting."
  },
  {
    id: 36,
    chapter: 2,
    topic: "Percentage Yield",
    question: "If the theoretical yield is 5.6g and the actual yield is 4.2g, what is the percentage yield?",
    options: ["75%", "80%", "60%", "90%"],
    correctAnswer: 0,
    explanation: "% yield = (actual / theoretical) * 100 = (4.2 / 5.6) * 100 = 75%."
  },
  {
    id: 37,
    chapter: 2,
    topic: "Atom Economy",
    question: "Which type of reaction always has 100% atom economy?",
    options: ["Substitution", "Elimination", "Addition", "Combustion"],
    correctAnswer: 2,
    explanation: "In addition reactions, all atoms in the reactants end up in the single desired product."
  },
  {
    id: 38,
    chapter: 2,
    topic: "Empirical Formula",
    question: "A compound has 40% C, 6.7% H, and 53.3% O. What is its empirical formula?",
    options: ["CHO", "CH2O", "C2H4O2", "CH3O"],
    correctAnswer: 1,
    explanation: "nC=40/12=3.33, nH=6.7/1=6.7, nO=53.3/16=3.33. Ratio 1:2:1 -> CH2O."
  },
  {
    id: 39,
    chapter: 2,
    topic: "Molecular Formula",
    question: "Empirical formula is CH2O (Mr=30). If actual Mr is 180, what is the molecular formula?",
    options: ["C3H6O3", "C6H12O6", "C2H4O2", "C5H10O5"],
    correctAnswer: 1,
    explanation: "n = 180 / 30 = 6. Molecular formula = (CH2O)6 = C6H12O6."
  },
  {
    id: 40,
    chapter: 2,
    topic: "Hydrated Salt",
    question: "Heating 5.00g of hydrated salt leaves 3.20g of anhydrous salt. What mass of water was lost?",
    options: ["1.80g", "3.20g", "5.00g", "8.20g"],
    correctAnswer: 0,
    explanation: "Mass lost = Initial mass - Final mass = 5.00 - 3.20 = 1.80g."
  },
  {
    id: 41,
    chapter: 3,
    topic: "Ionic Bonding",
    question: "Which of the following best describes ionic bonding?",
    options: [
      "Sharing of electron pairs between non-metals",
      "Electrostatic attraction between positive and negative ions",
      "Sea of delocalised electrons surrounding positive ions",
      "Attraction between polar molecules"
    ],
    correctAnswer: 1,
    explanation: "Ionic bonding is the electrostatic attraction between oppositely charged ions formed by electron transfer."
  },
  {
    id: 42,
    chapter: 3,
    topic: "Covalent Bonding",
    question: "How many electrons are shared in a double covalent bond?",
    options: ["1", "2", "4", "6"],
    correctAnswer: 2,
    explanation: "A single bond shares 2 electrons (1 pair), a double bond shares 4 electrons (2 pairs)."
  },
  {
    id: 43,
    chapter: 3,
    topic: "Dative Bonding",
    question: "What is a characteristic of a dative (coordinate) covalent bond?",
    options: [
      "Both electrons come from the same atom",
      "Electrons are transferred from a metal",
      "It only occurs in ionic compounds",
      "It is weaker than a normal covalent bond"
    ],
    correctAnswer: 0,
    explanation: "In a dative bond, one atom provides both electrons for the shared pair."
  },
  {
    id: 44,
    chapter: 3,
    topic: "VSEPR - Shapes",
    question: "What is the bond angle in a methane (CH4) molecule?",
    options: ["90°", "107°", "104.5°", "109.5°"],
    correctAnswer: 3,
    explanation: "Methane has 4 bonding pairs and no lone pairs, resulting in a tetrahedral shape with 109.5° angles."
  },
  {
    id: 45,
    chapter: 3,
    topic: "VSEPR - Shapes",
    question: "Why is the bond angle in ammonia (NH3) 107° instead of 109.5°?",
    options: [
      "It has 3 bonding pairs",
      "Lone pair-bonding pair repulsion is stronger than bonding pair-bonding pair repulsion",
      "Nitrogen is more electronegative than Hydrogen",
      "It is a planar molecule"
    ],
    correctAnswer: 1,
    explanation: "Lone pairs repel more strongly than bonding pairs, pushing the bonding pairs closer together and reducing the angle."
  },
  {
    id: 46,
    chapter: 3,
    topic: "Electronegativity",
    question: "Which element is the most electronegative in the periodic table?",
    options: ["Oxygen", "Chlorine", "Fluorine", "Francium"],
    correctAnswer: 2,
    explanation: "Fluorine has the highest ability to attract bonding electrons."
  },
  {
    id: 47,
    chapter: 3,
    topic: "Bond Polarity",
    question: "Why is CO2 a non-polar molecule despite having polar C=O bonds?",
    options: [
      "The bonds are actually non-polar",
      "It is a bent molecule",
      "The linear shape causes dipoles to cancel out",
      "Carbon and Oxygen have the same electronegativity"
    ],
    correctAnswer: 2,
    explanation: "CO2 is linear and symmetrical, so the bond dipoles act in opposite directions and cancel each other."
  },
  {
    id: 48,
    chapter: 3,
    topic: "Intermolecular Forces",
    question: "Which type of intermolecular force is the strongest?",
    options: ["London forces", "Permanent dipole-dipole", "Hydrogen bonding", "Ionic bonding"],
    correctAnswer: 2,
    explanation: "Hydrogen bonding is the strongest type of intermolecular force (though weaker than covalent/ionic bonds)."
  },
  {
    id: 49,
    chapter: 3,
    topic: "Metallic Bonding",
    question: "What allows metals to conduct electricity?",
    options: [
      "Movement of positive ions",
      "Delocalised electrons that are free to move",
      "Strong ionic lattice",
      "Sharing of electron pairs"
    ],
    correctAnswer: 1,
    explanation: "The 'sea' of delocalised electrons can move through the structure when a potential difference is applied."
  },
  {
    id: 50,
    chapter: 3,
    topic: "Bond Enthalpy",
    question: "Which state of matter must reactants and products be in for bond enthalpy definitions?",
    options: ["Solid", "Liquid", "Gaseous", "Aqueous"],
    correctAnswer: 2,
    explanation: "Bond enthalpy is defined as the energy to break 1 mole of bonds in the gaseous state."
  },
  {
    id: 51,
    chapter: 4,
    topic: "States of Matter",
    question: "Which of the following describes the particles in a solid?",
    options: [
      "Far apart and move randomly",
      "Closely packed and vibrate in fixed positions",
      "Close together but can slide past each other",
      "Move rapidly in all directions"
    ],
    correctAnswer: 1,
    explanation: "In a solid, particles are closely packed in a regular lattice and only vibrate about fixed positions."
  },
  {
    id: 52,
    chapter: 4,
    topic: "Gas Laws",
    question: "According to Boyle's Law, what happens to the pressure of a gas if its volume is halved at constant temperature?",
    options: [
      "Pressure is halved",
      "Pressure stays the same",
      "Pressure doubles",
      "Pressure quadruples"
    ],
    correctAnswer: 2,
    explanation: "Boyle's Law states P1V1 = P2V2. If volume decreases (halved), pressure must increase (double) to keep the product constant."
  },
  {
    id: 53,
    chapter: 4,
    topic: "Ideal Gas Equation",
    question: "What is the value of the gas constant R used in the ideal gas equation PV = nRT?",
    options: ["8.31 J mol⁻¹K⁻¹", "0.0821 L atm mol⁻¹K⁻¹", "24.0 dm³", "6.02 x 10²³"],
    correctAnswer: 0,
    explanation: "In the SI system used in A-Level Chemistry, R = 8.31 J mol⁻¹K⁻¹."
  },
  {
    id: 54,
    chapter: 4,
    topic: "Maxwell-Boltzmann Distribution",
    question: "How does the Maxwell-Boltzmann distribution curve change when temperature increases?",
    options: [
      "The peak shifts left and becomes higher",
      "The peak shifts right and becomes lower",
      "The area under the curve increases",
      "The activation energy decreases"
    ],
    correctAnswer: 1,
    explanation: "At higher temperatures, the curve becomes lower and broader, and the peak (most probable energy) shifts to the right."
  },
  {
    id: 55,
    chapter: 4,
    topic: "Vapor Pressure",
    question: "What is the relationship between temperature and vapor pressure?",
    options: [
      "Vapor pressure decreases as temperature increases",
      "Vapor pressure is independent of temperature",
      "Vapor pressure increases as temperature increases",
      "Vapor pressure only exists at the boiling point"
    ],
    correctAnswer: 2,
    explanation: "As temperature increases, more molecules have enough kinetic energy to escape the liquid surface, increasing the vapor pressure."
  },
  {
    id: 56,
    chapter: 4,
    topic: "Ideal Gas Deviations",
    question: "Under which conditions do real gases deviate most from ideal behavior?",
    options: [
      "High temperature and low pressure",
      "Low temperature and high pressure",
      "High temperature and high pressure",
      "Low temperature and low pressure"
    ],
    correctAnswer: 1,
    explanation: "Real gases deviate most at low temperatures (IMF become significant) and high pressures (molecular volume becomes significant)."
  },
  {
    id: 57,
    chapter: 4,
    topic: "Sublimation",
    question: "Which of the following substances undergoes sublimation at room temperature and pressure?",
    options: ["Water", "Sodium Chloride", "Iodine", "Copper"],
    correctAnswer: 2,
    explanation: "Iodine crystals sublime directly from solid to purple vapor when heated gently."
  },
  {
    id: 58,
    chapter: 4,
    topic: "Maxwell-Boltzmann Distribution",
    question: "What does the area under a Maxwell-Boltzmann distribution curve represent?",
    options: [
      "The total energy of the system",
      "The activation energy",
      "The total number of molecules",
      "The average velocity of molecules"
    ],
    correctAnswer: 2,
    explanation: "The area under the curve represents the total number of particles in the sample."
  },
  {
    id: 59,
    chapter: 4,
    topic: "Gas Laws",
    question: "Which temperature scale MUST be used in gas law calculations?",
    options: ["Celsius (°C)", "Fahrenheit (°F)", "Kelvin (K)", "Rankine (°R)"],
    correctAnswer: 2,
    explanation: "Absolute temperature in Kelvin (K = °C + 273) must be used for all gas law equations."
  },
  {
    id: 60,
    chapter: 4,
    topic: "Intermolecular Forces",
    question: "Why does water have a much higher boiling point than hydrogen sulfide (H2S)?",
    options: [
      "Water is a smaller molecule",
      "Water has stronger London forces",
      "Water can form hydrogen bonds",
      "H2S is more polar"
    ],
    correctAnswer: 2,
    explanation: "Water forms strong hydrogen bonds between molecules, which require more energy to break than the dipole-dipole forces in H2S."
  },
  {
    id: 61,
    chapter: 5,
    topic: "Periodicity",
    question: "How does the atomic radius change across a period from left to right?",
    options: [
      "Increases",
      "Decreases",
      "Stays the same",
      "Increases then decreases"
    ],
    correctAnswer: 1,
    explanation: "Across a period, the nuclear charge increases while shielding remains constant, pulling the outer electrons closer to the nucleus."
  },
  {
    id: 62,
    chapter: 5,
    topic: "Periodicity",
    question: "Which element has the highest electronegativity?",
    options: ["Oxygen", "Chlorine", "Fluorine", "Neon"],
    correctAnswer: 2,
    explanation: "Fluorine is the most electronegative element because it has a high nuclear charge and small atomic radius."
  },
  {
    id: 63,
    chapter: 5,
    topic: "Group 2",
    question: "What is the trend in reactivity down Group 2 (Mg to Ba)?",
    options: [
      "Reactivity decreases",
      "Reactivity increases",
      "Reactivity stays the same",
      "Reactivity first increases then decreases"
    ],
    correctAnswer: 1,
    explanation: "Reactivity increases down Group 2 because the first and second ionisation energies decrease as the outer electrons are further from the nucleus."
  },
  {
    id: 64,
    chapter: 5,
    topic: "Group 7",
    question: "Which halogen is the strongest oxidising agent?",
    options: ["Fluorine", "Chlorine", "Bromine", "Iodine"],
    correctAnswer: 0,
    explanation: "Fluorine is the most reactive halogen and the strongest oxidising agent because it has the highest electronegativity."
  },
  {
    id: 65,
    chapter: 5,
    topic: "Periodicity",
    question: "What happens to the first ionisation energy down a group?",
    options: [
      "Increases",
      "Decreases",
      "Stays the same",
      "Decreases then increases"
    ],
    correctAnswer: 1,
    explanation: "Down a group, the atomic radius and shielding increase, making it easier to remove the outermost electron."
  },
  {
    id: 66,
    chapter: 5,
    topic: "Periodicity",
    question: "Which of the following describes the trend in oxide nature across Period 3?",
    options: [
      "Acidic → Basic",
      "Basic → Amphoteric → Acidic",
      "Amphoteric → Basic → Acidic",
      "Basic → Acidic → Amphoteric"
    ],
    correctAnswer: 1,
    explanation: "Across Period 3, oxides change from basic (Na, Mg) to amphoteric (Al) to acidic (Si, P, S, Cl)."
  },
  {
    id: 67,
    chapter: 5,
    topic: "Group 7",
    question: "In the displacement reaction Cl₂ + 2Br⁻ → 2Cl⁻ + Br₂, why does chlorine displace bromine?",
    options: [
      "Chlorine is a larger atom",
      "Chlorine is more reactive than bromine",
      "Bromine is more electronegative",
      "Chlorine has more electron shells"
    ],
    correctAnswer: 1,
    explanation: "Chlorine is more reactive (a stronger oxidising agent) than bromine, so it can displace bromide ions from solution."
  },
  {
    id: 68,
    chapter: 5,
    topic: "Periodicity",
    question: "What is shielding effect?",
    options: [
      "The attraction of the nucleus for outer electrons",
      "The repulsion of outer electrons by inner shell electrons",
      "The total positive charge of the nucleus",
      "The distance between the nucleus and outer shell"
    ],
    correctAnswer: 1,
    explanation: "Shielding effect is the reduction in nuclear attraction on outer electrons caused by the repulsion from inner shell electrons."
  },
  {
    id: 69,
    chapter: 5,
    topic: "Group 2",
    question: "What is the general formula for the ion formed by Group 2 elements?",
    options: ["M⁺", "M²⁺", "M⁻", "M²⁻"],
    correctAnswer: 1,
    explanation: "Group 2 elements have 2 valence electrons and lose them to form 2+ ions (M²⁺)."
  },
  {
    id: 70,
    chapter: 5,
    topic: "Periodicity",
    question: "Why does atomic radius increase down a group?",
    options: [
      "Nuclear charge increases",
      "Number of protons increases",
      "Number of electron shells increases",
      "Electronegativity increases"
    ],
    correctAnswer: 2,
    explanation: "Down a group, each successive element has an additional electron shell, which increases the distance between the nucleus and outer electrons."
  }
];
