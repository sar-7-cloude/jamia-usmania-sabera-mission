/* ============================================================
   JAMIA USMANIA SABERA MISSION — data.js
   Single place to edit courses, announcements, events & gallery.
   Change the data here and every page updates automatically.
   ============================================================ */

window.JUSM = {

  announcements: [
    "Admissions open for the academic year 2026\u201327 \u2014 limited seats in Hifz-e-Quran and Aalim Course.",
    "Annual Day & Prize Distribution: 15 November 2026 \u2014 all parents are cordially invited.",
    "Half-yearly examinations begin from 10 October 2026 \u2014 timetable available at the office.",
    "New hostel block with 100 seats is now open for boarders."
  ],

  courses: [
    {
      id: "nazra",
      name: "Nazra-e-Quran",
      urdu: "\u0646\u0627\u0638\u0631\u06c1 \u0642\u0631\u0622\u0646",
      tag: "Beginner",
      duration: "1 year",
      seats: 60,
      fee: "\u20b9300 / month",
      admissionFee: "\u20b9500 one-time",
      eligibility: "Age 5+ \u00b7 no prior knowledge required",
      desc: "Correct reading of the Holy Quran with tajweed, along with basic duas, salah and Islamic manners for young beginners."
    },
    {
      id: "hifz",
      name: "Hifz-e-Quran",
      urdu: "\u062d\u0641\u0638 \u0642\u0631\u0622\u0646",
      tag: "Intermediate",
      duration: "3\u20134 years",
      seats: 30,
      fee: "\u20b9500 / month",
      admissionFee: "\u20b91,000 one-time",
      eligibility: "Completed Nazra \u00b7 entrance test",
      desc: "Complete memorisation of the Holy Quran under experienced huffaz, with daily sabaq, sabqi and manzil revision."
    },
    {
      id: "aalim",
      name: "Aalim Course (Dars-e-Nizami)",
      urdu: "\u062f\u0631\u0633 \u0646\u0638\u0627\u0645\u06cc",
      tag: "Advanced",
      duration: "6 years",
      seats: 25,
      fee: "\u20b9700 / month",
      admissionFee: "\u20b91,000 one-time",
      eligibility: "Completed Hifz or equivalent",
      desc: "In-depth study of Arabic grammar, fiqh, tafseer, hadith and aqeedah, along with Urdu and modern subjects."
    },
    {
      id: "ifta",
      name: "Ifta (Mufti) Course",
      urdu: "\u0627\u0641\u062a\u0627\u0621",
      tag: "Advanced",
      duration: "2 years",
      seats: 10,
      fee: "\u20b9900 / month",
      admissionFee: "\u20b92,000 one-time",
      eligibility: "Aalim course graduate",
      desc: "Specialised training in issuing religious verdicts (fatawa), usul-ul-fiqh and research methodology."
    },
    {
      id: "school",
      name: "Modern Schooling (NIOS)",
      urdu: "\u062c\u062f\u06cc\u062f \u062a\u0639\u0644\u06cc\u0645",
      tag: "Support",
      duration: "Alongside main course",
      seats: 80,
      fee: "\u20b9400 / month",
      admissionFee: "\u20b9800 one-time",
      eligibility: "Open to all students",
      desc: "Maths, science, English and social studies up to Class 10 through the National Institute of Open Schooling."
    },
    {
      id: "computer",
      name: "Computer & Vocational Skills",
      urdu: "\u06a9\u0645\u067e\u06cc\u0648\u0679\u0631 \u0679\u0631\u06cc\u0646\u0646\u06af",
      tag: "Support",
      duration: "6 months",
      seats: 40,
      fee: "\u20b9600 / month",
      admissionFee: "\u20b9500 one-time",
      eligibility: "Age 12+",
      desc: "Basic computer literacy, typing, office tools and vocational skills for self-reliance after graduation."
    }
  ],

  events: [
    { date: "2026-10-10", title: "Half-yearly examinations begin", desc: "Exams for all courses. Timetable available from the office." },
    { date: "2026-10-26", title: "Quran recitation competition", desc: "Inter-department tilawah and azan competition for all students." },
    { date: "2026-11-15", title: "Annual Day & prize distribution", desc: "Scholars, parents and well-wishers are cordially invited." },
    { date: "2026-12-05", title: "Parent\u2013teacher meeting", desc: "Discuss your child's progress with class teachers, 10 am \u2013 1 pm." },
    { date: "2027-01-20", title: "Admission open house", desc: "Campus tour and guidance session for admissions 2027\u201328." }
  ],

  gallery: [
    { file: "g1.svg", caption: "Morning assembly" },
    { file: "g2.svg", caption: "Quran class in progress" },
    { file: "g3.svg", caption: "Central library" },
    { file: "g4.svg", caption: "Computer lab" },
    { file: "g5.svg", caption: "Annual day function" },
    { file: "g6.svg", caption: "Sports day" },
    { file: "g7.svg", caption: "Hostel block" },
    { file: "g8.svg", caption: "Prayer (namaz) hall" }
  ],

  contact: {
    phone: "+91 90000 00000",
    email: "info@jamiausmania.org",
    address: "Jamia Usmania Sabera Mission, 12-4-5 Near Idgah, Azampura, Hyderabad \u2013 500020, Telangana",
    hours: "Monday \u2013 Saturday \u00b7 8:00 am \u2013 4:00 pm"
  }
};
