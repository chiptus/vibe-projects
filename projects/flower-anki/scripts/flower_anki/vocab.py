"""The source's Hebrew values, and the English tag names they map to."""

UNKNOWN_VALUES = {"לא יודע", "לא נמסר מידע"}
NOT_POPULAR_LIFE_FORMS = {"טחבים", "שרכים"}  # mosses, ferns
PROTECTED = "צמח מוגן"

LIFE_FORM_TAGS = {
    "חד-שנתי": "annual",
    "עשבוני רב-שנתי": "perennial",
    "שיח ובן-שיח": "shrub",
    "בעל בצל או פקעת (גיאופיט)": "geophyte",
    "עץ": "tree",
    "מטפס": "climber",
    "טפיל": "parasite",
    "טחבים": "moss",
    "שרכים": "fern",
}
COLOR_TAGS = {
    "צהוב": "yellow",
    "לבן": "white",
    "ורוד": "pink",
    "ירוק": "green",
    "קרם": "cream",
    "סגול": "purple",
    "בורדו": "bordeaux",
    "חום": "brown",
    "כחול": "blue",
    "תכלת": "light-blue",
    "אדום": "red",
    "כתום": "orange",
}
STATUS_TAGS = {
    "בסכנת הכחדה": "endangered",
    PROTECTED: "protected",
    "צמח צופני": "nectar",
    "צמח המשומש לרפואה": "medicinal",
    "תבלין ו/או צמח מאכל": "edible",
    "צמח רעיל": "poisonous",
    "צמח אלרגני": "allergenic",
    "צמח פולש": "invasive",
    "צמח מיובא": "introduced",
}
MONTHS = [
    "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
    "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
]  # fmt: skip
