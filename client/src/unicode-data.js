// Unicode block definitions with codepoint ranges
// Source: Unicode Standard blocks
export const unicodeBlocks = {
  // Basic Latin & Extended
  "Basic Latin": { start: 0x0000, end: 0x007F },
  "Latin-1 Supplement": { start: 0x0080, end: 0x00FF },
  "Latin Extended-A": { start: 0x0100, end: 0x017F },
  "Latin Extended-B": { start: 0x0180, end: 0x024F },
  "Latin Extended-C": { start: 0x2C60, end: 0x2C7F },
  "Latin Extended-D": { start: 0xA720, end: 0xA7FF },
  "Latin Extended-E": { start: 0xAB30, end: 0xAB6F },
  "Latin Extended-F": { start: 0x10780, end: 0x107BF },
  "Latin Extended-G": { start: 0x1DF00, end: 0x1DFFF },
  "Latin Extended Additional": { start: 0x1E00, end: 0x1EFF },
  
  // Greek
  "Greek and Coptic": { start: 0x0370, end: 0x03FF },
  "Ancient Greek Numbers": { start: 0x10140, end: 0x1018F },
  
  // Cyrillic
  "Cyrillic": { start: 0x0400, end: 0x04FF },
  "Cyrillic Supplement": { start: 0x0500, end: 0x052F },
  "Cyrillic Extended-A": { start: 0x2DE0, end: 0x2DFF },
  "Cyrillic Extended-B": { start: 0xA640, end: 0xA69F },
  "Cyrillic Extended-C": { start: 0x1C80, end: 0x1C8F },
  "Cyrillic Extended-D": { start: 0x1E030, end: 0x1E08F },
  
  // Armenian
  "Armenian": { start: 0x0530, end: 0x058F },
  
  // Georgian
  "Georgian": { start: 0x10A0, end: 0x10FF },
  "Georgian Supplement": { start: 0x2D00, end: 0x2D2F },
  "Georgian Extended": { start: 0x1C90, end: 0x1CBF },
  
  // Ethiopic
  "Ethiopic": { start: 0x1200, end: 0x137F },
  "Ethiopic Supplement": { start: 0x1380, end: 0x139F },
  "Ethiopic Extended": { start: 0x2D80, end: 0x2DDF },
  "Ethiopic Extended-A": { start: 0xAB00, end: 0xAB2F },
  "Ethiopic Extended-B": { start: 0x1E7E0, end: 0x1E7FF },
  
  // NKo
  "N'Ko": { start: 0x07C0, end: 0x07FF },
  
  // Adlam
  "Adlam": { start: 0x1E900, end: 0x1E95F },
  
  // Tifinagh
  "Tifinagh": { start: 0x2D30, end: 0x2D7F },
  
  // Hebrew
  "Hebrew": { start: 0x0590, end: 0x05FF },
  
  // Arabic
  "Arabic": { start: 0x0600, end: 0x06FF },
  "Arabic Supplement": { start: 0x0750, end: 0x077F },
  "Arabic Extended-A": { start: 0x08A0, end: 0x08FF },
  "Arabic Extended-B": { start: 0x0870, end: 0x089F },
  "Arabic Extended-C": { start: 0x10EC0, end: 0x10EFF },
  "Arabic Presentation Forms-A": { start: 0xFB50, end: 0xFDFF },
  "Arabic Presentation Forms-B": { start: 0xFE70, end: 0xFEFF },
  "Arabic Mathematical Alphabetic Symbols": { start: 0x1EE00, end: 0x1EEFF },
  
  // Syriac
  "Syriac": { start: 0x0700, end: 0x074F },
  "Syriac Supplement": { start: 0x0860, end: 0x086F },
  
  // Semitic Historical
  "Phoenician": { start: 0x10900, end: 0x1091F },
  "Ugaritic": { start: 0x10380, end: 0x1039F },
  "Old South Arabian": { start: 0x10A60, end: 0x10A7F },
  "Old North Arabian": { start: 0x10A80, end: 0x10A9F },
  
  // Iranian Historical
  "Old Persian": { start: 0x103A0, end: 0x103DF },
  
  // Indic Modern
  "Devanagari": { start: 0x0900, end: 0x097F },
  "Devanagari Extended": { start: 0xA8E0, end: 0xA8FF },
  "Bengali": { start: 0x0980, end: 0x09FF },
  "Gurmukhi": { start: 0x0A00, end: 0x0A7F },
  "Gujarati": { start: 0x0A80, end: 0x0AFF },
  "Oriya": { start: 0x0B00, end: 0x0B7F },
  "Tamil": { start: 0x0B80, end: 0x0BFF },
  "Tamil Supplement": { start: 0x11FC0, end: 0x11FFF },
  "Telugu": { start: 0x0C00, end: 0x0C7F },
  "Kannada": { start: 0x0C80, end: 0x0CFF },
  "Malayalam": { start: 0x0D00, end: 0x0D7F },
  "Sinhala": { start: 0x0D80, end: 0x0DFF },
  
  // Indic Historical
  "Brahmi": { start: 0x11000, end: 0x1107F },
  "Grantha": { start: 0x11300, end: 0x1137F },
  "Sharada": { start: 0x11180, end: 0x111DF },
  "Siddham": { start: 0x11580, end: 0x115FF },
  "Modi": { start: 0x11600, end: 0x1165F },
  "Kaithi": { start: 0x11080, end: 0x110CF },
  "Mahajani": { start: 0x11150, end: 0x1117F },
  "Khojki": { start: 0x11200, end: 0x1124F },
  "Multani": { start: 0x11280, end: 0x112AF },
  
  // Japanese
  "Hiragana": { start: 0x3040, end: 0x309F },
  "Katakana": { start: 0x30A0, end: 0x30FF },
  "Katakana Phonetic Extensions": { start: 0x31F0, end: 0x31FF },
  
  // Korean
  "Hangul Jamo": { start: 0x1100, end: 0x11FF },
  "Hangul Jamo Extended-A": { start: 0xA960, end: 0xA97F },
  "Hangul Jamo Extended-B": { start: 0xD7B0, end: 0xD7FF },
  "Hangul Syllables": { start: 0xAC00, end: 0xD7AF },
  "Hangul Compatibility Jamo": { start: 0x3130, end: 0x318F },
  
  // Tibetan
  "Tibetan": { start: 0x0F00, end: 0x0FFF },
  
  // Myanmar
  "Myanmar": { start: 0x1000, end: 0x109F },
  "Myanmar Extended-A": { start: 0xAA60, end: 0xAA7F },
  "Myanmar Extended-B": { start: 0xA9E0, end: 0xA9FF },
  "Myanmar Extended-C": { start: 0x116D0, end: 0x116FF },
  
  // Khmer
  "Khmer": { start: 0x1780, end: 0x17FF },
  "Khmer Symbols": { start: 0x19E0, end: 0x19FF },
  
  // Thai
  "Thai": { start: 0x0E00, end: 0x0E7F },
  
  // Lao
  "Lao": { start: 0x0E80, end: 0x0EFF },
  
  // Tai
  "Tai Le": { start: 0x1950, end: 0x197F },
  "Tai Tham": { start: 0x1A20, end: 0x1AAF },
  "Tai Viet": { start: 0xAA80, end: 0xAADF },
  "Tai Yo": { start: 0x1CE50, end: 0x1CE9F },
  "New Tai Lue": { start: 0x1980, end: 0x19DF },
  
  // Mongolian
  "Mongolian": { start: 0x1800, end: 0x18AF },
  "Mongolian Supplement": { start: 0x11660, end: 0x1167F },
  
  // Phags-pa
  "Phags-pa": { start: 0xA840, end: 0xA87F },
  
  // CJK
  "CJK Unified Ideographs": { start: 0x4E00, end: 0x9FFF },
  "CJK Unified Ideographs Extension A": { start: 0x3400, end: 0x4DBF },
  "CJK Unified Ideographs Extension B": { start: 0x20000, end: 0x2A6DF },
  "CJK Symbols and Punctuation": { start: 0x3000, end: 0x303F },
  "CJK Compatibility": { start: 0x3300, end: 0x33FF },
  "CJK Compatibility Forms": { start: 0xFE30, end: 0xFE4F },
  "CJK Compatibility Ideographs": { start: 0xF900, end: 0xFAFF },
  "CJK Radicals Supplement": { start: 0x2E80, end: 0x2EFF },
  "CJK Strokes": { start: 0x31C0, end: 0x31EF },
  "Kangxi Radicals": { start: 0x2F00, end: 0x2FDF },
  
  // Cherokee
  "Cherokee": { start: 0x13A0, end: 0x13FF },
  "Cherokee Supplement": { start: 0xAB70, end: 0xABBF },
  
  // Canadian Aboriginal
  "Unified Canadian Aboriginal Syllabics": { start: 0x1400, end: 0x167F },
  "Unified Canadian Aboriginal Syllabics Extended": { start: 0x18B0, end: 0x18FF },
  "Unified Canadian Aboriginal Syllabics Extended-A": { start: 0x11AB0, end: 0x11ABF },
  
  // Diacritics & Phonetics
  "Combining Diacritical Marks": { start: 0x0300, end: 0x036F },
  "Combining Diacritical Marks Extended": { start: 0x1AB0, end: 0x1AFF },
  "Combining Diacritical Marks Supplement": { start: 0x1DC0, end: 0x1DFF },
  "Combining Diacritical Marks for Symbols": { start: 0x20D0, end: 0x20FF },
  "IPA Extensions": { start: 0x0250, end: 0x02AF },
  "Modifier Tone Letters": { start: 0xA700, end: 0xA71F },
  "Phonetic Extensions": { start: 0x1D00, end: 0x1D7F },
  "Phonetic Extensions Supplement": { start: 0x1D80, end: 0x1DBF },
  "Spacing Modifier Letters": { start: 0x02B0, end: 0x02FF },
  "Vedic Extensions": { start: 0x1CD0, end: 0x1CFF },
  
  // Punctuation & Separators
  "General Punctuation": { start: 0x2000, end: 0x206F },
  "Supplemental Punctuation": { start: 0x2E00, end: 0x2E7F },
  "Vertical Forms": { start: 0xFE10, end: 0xFE1F },
  
  // Numbers
  "Number Forms": { start: 0x2150, end: 0x218F },
  "Superscripts and Subscripts": { start: 0x2070, end: 0x209F },
  "Enclosed Alphanumerics": { start: 0x2460, end: 0x24FF },
  "Enclosed Alphanumeric Supplement": { start: 0x1F100, end: 0x1F1FF },
  "Enclosed CJK Letters and Months": { start: 0x3200, end: 0x32FF },
  "Common Indic Number Forms": { start: 0xA830, end: 0xA83F },
  "Aegean Numbers": { start: 0x10100, end: 0x1013F },
  "Counting Rod Numerals": { start: 0x1D360, end: 0x1D37F },
  
  // Currency
  "Currency Symbols": { start: 0x20A0, end: 0x20CF },
  
  // Arrows
  "Arrows": { start: 0x2190, end: 0x21FF },
  "Supplemental Arrows-A": { start: 0x27F0, end: 0x27FF },
  "Supplemental Arrows-B": { start: 0x2900, end: 0x297F },
  "Supplemental Arrows-C": { start: 0x1F800, end: 0x1F8FF },
  "Miscellaneous Symbols and Arrows": { start: 0x2B00, end: 0x2BFF },
  
  // Mathematics
  "Mathematical Operators": { start: 0x2200, end: 0x22FF },
  "Supplemental Mathematical Operators": { start: 0x2A00, end: 0x2AFF },
  "Miscellaneous Mathematical Symbols-A": { start: 0x27C0, end: 0x27EF },
  "Miscellaneous Mathematical Symbols-B": { start: 0x2980, end: 0x29FF },
  "Mathematical Alphanumeric Symbols": { start: 0x1D400, end: 0x1D7FF },
  
  // Technical
  "Miscellaneous Technical": { start: 0x2300, end: 0x23FF },
  "Control Pictures": { start: 0x2400, end: 0x243F },
  "Optical Character Recognition": { start: 0x2440, end: 0x245F },
  "Specials": { start: 0xFFF0, end: 0xFFFF },
  
  // Box & Shapes
  "Block Elements": { start: 0x2580, end: 0x259F },
  "Box Drawing": { start: 0x2500, end: 0x257F },
  "Geometric Shapes": { start: 0x25A0, end: 0x25FF },
  "Geometric Shapes Extended": { start: 0x1F780, end: 0x1F7FF },
  "Braille Patterns": { start: 0x2800, end: 0x28FF },
  
  // Symbols & Dingbats
  "Miscellaneous Symbols": { start: 0x2600, end: 0x26FF },
  "Dingbats": { start: 0x2700, end: 0x27BF },
  "Ornamental Dingbats": { start: 0x1F650, end: 0x1F67F },
  "Alchemical Symbols": { start: 0x1F700, end: 0x1F77F },
  "Chess Symbols": { start: 0x1FA00, end: 0x1FA6F },
  "Yijing Hexagram Symbols": { start: 0x4DC0, end: 0x4DFF },
  
  // Pictograms & Emoji
  "Emoticons": { start: 0x1F600, end: 0x1F64F },
  "Miscellaneous Symbols and Pictographs": { start: 0x1F300, end: 0x1F5FF },
  "Supplemental Symbols and Pictographs": { start: 0x1F900, end: 0x1F9FF },
  "Symbols and Pictographs Extended-A": { start: 0x1FA70, end: 0x1FAFF },
  "Transport and Map Symbols": { start: 0x1F680, end: 0x1F6FF },
  
  // Games
  "Domino Tiles": { start: 0x1F030, end: 0x1F09F },
  "Mahjong Tiles": { start: 0x1F000, end: 0x1F02F },
  "Playing Cards": { start: 0x1F0A0, end: 0x1F0FF },
  
  // Music
  "Musical Symbols": { start: 0x1D100, end: 0x1D1FF },
  "Ancient Greek Musical Notation": { start: 0x1D200, end: 0x1D24F },
  "Byzantine Musical Symbols": { start: 0x1D000, end: 0x1D0FF },
  
  // Presentation & Compatibility
  "Alphabetic Presentation Forms": { start: 0xFB00, end: 0xFB4F },
  "Halfwidth and Fullwidth Forms": { start: 0xFF00, end: 0xFFEF },
  "Small Form Variants": { start: 0xFE50, end: 0xFE6F },
  "Letterlike Symbols": { start: 0x2100, end: 0x214F },
  
  // Historical scripts
  "Runic": { start: 0x16A0, end: 0x16FF },
  "Ogham": { start: 0x1680, end: 0x169F },
  "Gothic": { start: 0x10330, end: 0x1034F },
  "Old Italic": { start: 0x10300, end: 0x1032F },
  "Coptic": { start: 0x2C80, end: 0x2CFF },
  "Glagolitic": { start: 0x2C00, end: 0x2C5F },
  "Glagolitic Supplement": { start: 0x1E000, end: 0x1E02F },
  
  // Other modern scripts
  "Thaana": { start: 0x0780, end: 0x07BF },
  "Samaritan": { start: 0x0800, end: 0x083F },
  "Mandaic": { start: 0x0840, end: 0x085F },
  "Javanese": { start: 0xA980, end: 0xA9DF },
  "Balinese": { start: 0x1B00, end: 0x1B7F },
  "Sundanese": { start: 0x1B80, end: 0x1BBF },
  "Sundanese Supplement": { start: 0x1CC0, end: 0x1CCF },
  "Buginese": { start: 0x1A00, end: 0x1A1F },
  "Batak": { start: 0x1BC0, end: 0x1BFF },
  "Lepcha": { start: 0x1C00, end: 0x1C4F },
  "Limbu": { start: 0x1900, end: 0x194F },
  "Ol Chiki": { start: 0x1C50, end: 0x1C7F },
  "Vai": { start: 0xA500, end: 0xA63F },
  "Bamum": { start: 0xA6A0, end: 0xA6FF },
  "Lisu": { start: 0xA4D0, end: 0xA4FF },
  "Lisu Supplement": { start: 0x11FB0, end: 0x11FBF },
  "Meetei Mayek": { start: 0xABC0, end: 0xABFF },
  "Meetei Mayek Extensions": { start: 0xAAE0, end: 0xAAFF },
  "Chakma": { start: 0x11100, end: 0x1114F },
  "Mro": { start: 0x16A40, end: 0x16A6F },
  "Pahawh Hmong": { start: 0x16B00, end: 0x16B8F },
  "Miao": { start: 0x16F00, end: 0x16F9F },
  "Tangsa": { start: 0x16A70, end: 0x16ACF },
  "Wancho": { start: 0x1E2C0, end: 0x1E2FF },
  "Newa": { start: 0x11400, end: 0x1147F },
  "Osage": { start: 0x104B0, end: 0x104FF },
  "Osmanya": { start: 0x10480, end: 0x104AF },
  "Shavian": { start: 0x10450, end: 0x1047F },
  "Bopomofo": { start: 0x3100, end: 0x312F },
  "Bopomofo Extended": { start: 0x31A0, end: 0x31BF },
  "Yi Syllables": { start: 0xA000, end: 0xA48F },
  "Yi Radicals": { start: 0xA490, end: 0xA4CF },
  
  // CJK Extensions C-J
  "CJK Unified Ideographs Extension C": { start: 0x2A700, end: 0x2B73F },
  "CJK Unified Ideographs Extension D": { start: 0x2B740, end: 0x2B81F },
  "CJK Unified Ideographs Extension E": { start: 0x2B820, end: 0x2CEAF },
  "CJK Unified Ideographs Extension F": { start: 0x2CEB0, end: 0x2EBEF },
  "CJK Unified Ideographs Extension G": { start: 0x30000, end: 0x3134F },
  "CJK Unified Ideographs Extension H": { start: 0x31350, end: 0x323AF },
  "CJK Unified Ideographs Extension I": { start: 0x2EBF0, end: 0x2EE5F },
  "CJK Unified Ideographs Extension J": { start: 0x323B0, end: 0x3347F },
  "CJK Compatibility Ideographs Supplement": { start: 0x2F800, end: 0x2FA1F },
  
  // Ideographic
  "Ideographic Description Characters": { start: 0x2FF0, end: 0x2FFF },
  "Ideographic Symbols and Punctuation": { start: 0x16FE0, end: 0x16FFF },
  "Enclosed Ideographic Supplement": { start: 0x1F200, end: 0x1F2FF },
  
  // Additional Numbers
  "Indic Siyaq Numbers": { start: 0x1EC70, end: 0x1ECBF },
  "Kaktovik Numerals": { start: 0x1D2C0, end: 0x1D2DF },
  "Mayan Numerals": { start: 0x1D2E0, end: 0x1D2FF },
  "Ottoman Siyaq Numbers": { start: 0x1ED00, end: 0x1ED4F },
  "Rumi Numeral Symbols": { start: 0x10E60, end: 0x10E7F },
  "Sinhala Archaic Numbers": { start: 0x111E0, end: 0x111FF },
  "Tai Xuan Jing Symbols": { start: 0x1D300, end: 0x1D35F },
  
  // Technical
  "Tags": { start: 0xE0000, end: 0xE007F },
  "Shorthand Format Controls": { start: 0x1BCA0, end: 0x1BCAF },
  
  // Symbols
  "Ancient Symbols": { start: 0x10190, end: 0x101CF },
  
  // Music
  "Znamenny Musical Notation": { start: 0x1CF00, end: 0x1CFCF },
  
  // Variation Selectors
  "Variation Selectors": { start: 0xFE00, end: 0xFE0F },
  "Variation Selectors Supplement": { start: 0xE0100, end: 0xE01EF },
  
  // Surrogates
  "High Private Use Surrogates": { start: 0xDB80, end: 0xDBFF },
  "High Surrogates": { start: 0xD800, end: 0xDB7F },
  "Low Surrogates": { start: 0xDC00, end: 0xDFFF },
  
  // Private Use
  "Private Use Area": { start: 0xE000, end: 0xF8FF },
  "Supplementary Private Use Area-A": { start: 0xF0000, end: 0xFFFFF },
  "Supplementary Private Use Area-B": { start: 0x100000, end: 0x10FFFF },
  
  // Kana
  "Kana Extended-A": { start: 0x1B100, end: 0x1B12F },
  "Kana Extended-B": { start: 0x1AFF0, end: 0x1AFFF },
  "Kana Supplement": { start: 0x1B000, end: 0x1B0FF },
  "Kanbun": { start: 0x3190, end: 0x319F },
  
  // Tangut
  "Tangut": { start: 0x17000, end: 0x187FF },
  "Tangut Components": { start: 0x18800, end: 0x18AFF },
  "Tangut Supplement": { start: 0x18D00, end: 0x18D8F },
  
  // Duployan
  "Duployan": { start: 0x1BC00, end: 0x1BC9F },
  
  // Khitan
  "Khitan Small Script": { start: 0x18B00, end: 0x18CFF },
  
  // Historical scripts for Escritas
  "Anatolian Hieroglyphs": { start: 0x14400, end: 0x1467F },
  "Carian": { start: 0x102A0, end: 0x102DF },
  "Caucasian Albanian": { start: 0x10530, end: 0x1056F },
  "Chorasmian": { start: 0x10FB0, end: 0x10FDF },
  "Coptic Epact Numbers": { start: 0x102E0, end: 0x102FF },
  "Cuneiform": { start: 0x12000, end: 0x123FF },
  "Cuneiform Numbers and Punctuation": { start: 0x12400, end: 0x1247F },
  "Early Dynastic Cuneiform": { start: 0x12480, end: 0x1254F },
  "Cypriot Syllabary": { start: 0x10800, end: 0x1083F },
  "Cypro-Minoan": { start: 0x12F90, end: 0x12FFF },
  "Egyptian Hieroglyph Format Controls": { start: 0x13430, end: 0x1345F },
  "Egyptian Hieroglyphs": { start: 0x13000, end: 0x1342F },
  "Egyptian Hieroglyphs Extended-A": { start: 0x13460, end: 0x143FF },
  "Elbasan": { start: 0x10500, end: 0x1052F },
  "Elymaic": { start: 0x10FE0, end: 0x10FFF },
  "Hatran": { start: 0x108E0, end: 0x108FF },
  "Imperial Aramaic": { start: 0x10840, end: 0x1085F },
  "Inscriptional Pahlavi": { start: 0x10B60, end: 0x10B7F },
  "Inscriptional Parthian": { start: 0x10B40, end: 0x10B5F },
  "Kharoshthi": { start: 0x10A00, end: 0x10A5F },
  "Linear A": { start: 0x10600, end: 0x1077F },
  "Linear B Ideograms": { start: 0x10080, end: 0x100FF },
  "Linear B Syllabary": { start: 0x10000, end: 0x1007F },
  "Lycian": { start: 0x10280, end: 0x1029F },
  "Lydian": { start: 0x10920, end: 0x1093F },
  "Manichaean": { start: 0x10AC0, end: 0x10AFF },
  "Meroitic Cursive": { start: 0x109A0, end: 0x109FF },
  "Meroitic Hieroglyphs": { start: 0x10980, end: 0x1099F },
  "Nabataean": { start: 0x10880, end: 0x108AF },
  "Old Hungarian": { start: 0x10C80, end: 0x10CFF },
  "Old Permic": { start: 0x10350, end: 0x1037F },
  "Old Sogdian": { start: 0x10F00, end: 0x10F2F },
  "Old Turkic": { start: 0x10C00, end: 0x10C4F },
  "Old Uyghur": { start: 0x10F70, end: 0x10FAF },
  "Palmyrene": { start: 0x10860, end: 0x1087F },
  "Phaistos Disc": { start: 0x101D0, end: 0x101FF },
  "Psalter Pahlavi": { start: 0x10B80, end: 0x10BAF },
  "Sogdian": { start: 0x10F30, end: 0x10F6F },
  "Vithkuqi": { start: 0x10570, end: 0x105BF },
  "Sidetic": { start: 0x105C0, end: 0x105FF },
  
  // Modern scripts for Escritas
  "Ahom": { start: 0x11700, end: 0x1174F },
  "Avestan": { start: 0x10B00, end: 0x10B3F },
  "Bamum Supplement": { start: 0x16800, end: 0x16A3F },
  "Bassa Vah": { start: 0x16AD0, end: 0x16AFF },
  "Bhaiksuki": { start: 0x11C00, end: 0x11C6F },
  "Buhid": { start: 0x1740, end: 0x175F },
  "Cham": { start: 0xAA00, end: 0xAA5F },
  "Combining Half Marks": { start: 0xFE20, end: 0xFE2F },
  "Dives Akuru": { start: 0x11900, end: 0x1195F },
  "Dogra": { start: 0x11800, end: 0x1184F },
  "Gunjala Gondi": { start: 0x11D60, end: 0x11DAF },
  "Hanifi Rohingya": { start: 0x10D00, end: 0x10D3F },
  "Hanunoo": { start: 0x1720, end: 0x173F },
  "Kayah Li": { start: 0xA900, end: 0xA92F },
  "Kawi": { start: 0x11F00, end: 0x11F5F },
  "Khudawadi": { start: 0x112B0, end: 0x112FF },
  "Makasar": { start: 0x11EE0, end: 0x11EFF },
  "Masaram Gondi": { start: 0x11D00, end: 0x11D5F },
  "Medefaidrin": { start: 0x16E40, end: 0x16E9F },
  "Mende Kikakui": { start: 0x1E800, end: 0x1E8DF },
  "Nandinagari": { start: 0x119A0, end: 0x119FF },
  "Nyiakeng Puachue Hmong": { start: 0x1E100, end: 0x1E14F },
  "Pau Cin Hau": { start: 0x11AC0, end: 0x11AFF },
  "Rejang": { start: 0xA930, end: 0xA95F },
  "Saurashtra": { start: 0xA880, end: 0xA8DF },
  "Sora Sompeng": { start: 0x110D0, end: 0x110FF },
  "Syloti Nagri": { start: 0xA800, end: 0xA82F },
  "Tagalog": { start: 0x1700, end: 0x171F },
  "Tagbanwa": { start: 0x1760, end: 0x177F },
  "Takri": { start: 0x11680, end: 0x116CF },
  "Tirhuta": { start: 0x11480, end: 0x114DF },
  "Toto": { start: 0x1E290, end: 0x1E2BF },
  "Warang Citi": { start: 0x118A0, end: 0x118FF },
  "Yezidi": { start: 0x10E80, end: 0x10EBF },
  "Zanabazar Square": { start: 0x11A00, end: 0x11A4F },
  "Sutton SignWriting": { start: 0x1D800, end: 0x1DAAF },
  "Garay": { start: 0x10D40, end: 0x10D8F },
  "Gurung Khema": { start: 0x16100, end: 0x1613F },
  "Kirat Rai": { start: 0x16D40, end: 0x16D7F },
  "Nag Mundari": { start: 0x1E4D0, end: 0x1E4FF },
  "Ol Onal": { start: 0x1E5D0, end: 0x1E5FF },
  "Sunuwar": { start: 0x11BC0, end: 0x11BFF },
  "Todhri": { start: 0x105A0, end: 0x105BF },
  "Tolong Siki": { start: 0x1E0C0, end: 0x1E0FF },
  "Tulu-Tigalari": { start: 0x11380, end: 0x113FF },
  "Beria Erfe": { start: 0x10EF0, end: 0x10F2F }
};

// Hierarchy for navigation
export const pageHierarchy = {
  "Linguas": {
    "Europa": {
      "Alfabeticas": {
        "Latin": ["Basic Latin", "Latin-1 Supplement", "Latin Extended-A", "Latin Extended-B", "Latin Extended-C", "Latin Extended-D", "Latin Extended-E", "Latin Extended-F", "Latin Extended-G"],
        "Greek": ["Greek and Coptic", "Ancient Greek Numbers"],
        "Cyrillic": ["Cyrillic", "Cyrillic Supplement", "Cyrillic Extended-A", "Cyrillic Extended-B", "Cyrillic Extended-C"],
        "Armenian": ["Armenian"],
        "Georgian": ["Georgian", "Georgian Supplement", "Georgian Extended"]
      }
    },
    "Africa": {
      "Alfabeticas": {
        "Ethiopic": ["Ethiopic", "Ethiopic Supplement", "Ethiopic Extended", "Ethiopic Extended-A"],
        "Nko": ["N'Ko"],
        "Adlam": ["Adlam"],
        "Tifinagh": ["Tifinagh"]
      }
    },
    "Asia": {
      "Alfabeticas": {
        "Hebrew": ["Hebrew"],
        "Arabic": ["Arabic", "Arabic Supplement", "Arabic Extended-A", "Arabic Extended-B", "Arabic Presentation Forms-A", "Arabic Presentation Forms-B"],
        "Syriac": ["Syriac", "Syriac Supplement"],
        "Semiticas_antigas": ["Phoenician", "Ugaritic", "Old South Arabian", "Old North Arabian"],
        "Iranicas_antigas": ["Old Persian"]
      },
      "Abugidas": {
        "Indic_modernas": ["Devanagari", "Devanagari Extended", "Bengali", "Gurmukhi", "Gujarati", "Oriya", "Tamil", "Tamil Supplement", "Telugu", "Kannada", "Malayalam", "Sinhala"],
        "Indic_historicas": ["Brahmi", "Grantha", "Sharada", "Siddham", "Modi", "Kaithi", "Mahajani", "Khojki", "Multani"]
      },
      "Silabicas": {
        "Japanese": ["Hiragana", "Katakana", "Katakana Phonetic Extensions"],
        "Korean": ["Hangul Jamo", "Hangul Jamo Extended-A", "Hangul Jamo Extended-B", "Hangul Syllables", "Hangul Compatibility Jamo"],
        "Tibetan": ["Tibetan"],
        "Myanmar": ["Myanmar", "Myanmar Extended-A", "Myanmar Extended-B"],
        "Khmer": ["Khmer", "Khmer Symbols"],
        "Thai": ["Thai"],
        "Lao": ["Lao"],
        "Tai": ["Tai Le", "Tai Tham", "Tai Viet"],
        "Mongolian": ["Mongolian", "Mongolian Supplement"],
        "Phags_pa": ["Phags-pa"]
      },
      "Logograficas": {
        "Cjk": [
          "CJK Unified Ideographs", "CJK Unified Ideographs Extension A", "CJK Unified Ideographs Extension B",
          "CJK Unified Ideographs Extension C", "CJK Unified Ideographs Extension D", "CJK Unified Ideographs Extension E",
          "CJK Unified Ideographs Extension F", "CJK Unified Ideographs Extension G", "CJK Unified Ideographs Extension H",
          "CJK Unified Ideographs Extension I", "CJK Unified Ideographs Extension J",
          "CJK Symbols and Punctuation", "CJK Compatibility", "CJK Compatibility Forms",
          "CJK Compatibility Ideographs", "CJK Compatibility Ideographs Supplement"
        ]
      }
    },
    "Americas": {
      "Silabicas": {
        "Cherokee": ["Cherokee", "Cherokee Supplement"],
        "Canadian_aboriginal": ["Unified Canadian Aboriginal Syllabics", "Unified Canadian Aboriginal Syllabics Extended"]
      }
    }
  },
  "Diacriticos_e_Fonetica": [
    "Combining Diacritical Marks", "Combining Diacritical Marks Extended", "Combining Diacritical Marks Supplement",
    "Combining Diacritical Marks for Symbols", "IPA Extensions", "Modifier Tone Letters",
    "Phonetic Extensions", "Phonetic Extensions Supplement", "Spacing Modifier Letters", "Vedic Extensions"
  ],
  "Pontuacao_e_Separadores": [
    "General Punctuation", "Ideographic Description Characters", "Ideographic Symbols and Punctuation",
    "Shorthand Format Controls", "Supplemental Punctuation", "Vertical Forms"
  ],
  "Numeros_e_Envolventes": [
    "Aegean Numbers", "Common Indic Number Forms", "Counting Rod Numerals",
    "Enclosed Alphanumeric Supplement", "Enclosed Alphanumerics", "Enclosed CJK Letters and Months",
    "Enclosed Ideographic Supplement", "Indic Siyaq Numbers", "Kaktovik Numerals", "Mayan Numerals",
    "Number Forms", "Ottoman Siyaq Numbers", "Rumi Numeral Symbols", "Sinhala Archaic Numbers",
    "Superscripts and Subscripts", "Tai Xuan Jing Symbols"
  ],
  "Moeda_e_Unidades": ["Currency Symbols"],
  "Setas": [
    "Arrows", "Miscellaneous Symbols and Arrows",
    "Supplemental Arrows-A", "Supplemental Arrows-B", "Supplemental Arrows-C"
  ],
  "Matematica": [
    "Arabic Mathematical Alphabetic Symbols", "Mathematical Alphanumeric Symbols",
    "Mathematical Operators", "Miscellaneous Mathematical Symbols-A",
    "Miscellaneous Mathematical Symbols-B", "Supplemental Mathematical Operators"
  ],
  "Tecnico_e_Controlo": [
    "Control Pictures", "Miscellaneous Technical", "Optical Character Recognition", "Specials", "Tags"
  ],
  "Caixas_e_Formas": [
    "Block Elements", "Box Drawing", "Braille Patterns", "Geometric Shapes", "Geometric Shapes Extended"
  ],
  "Simbolos_Gerais_e_Dingbats": [
    "Alchemical Symbols", "Chess Symbols", "Dingbats", "Miscellaneous Symbols",
    "Ornamental Dingbats", "Yijing Hexagram Symbols"
  ],
  "Pictogramas_e_Emoji": [
    "Emoticons", "Miscellaneous Symbols and Pictographs", "Supplemental Symbols and Pictographs",
    "Symbols and Pictographs Extended-A", "Transport and Map Symbols"
  ],
  "Jogos": ["Domino Tiles", "Mahjong Tiles", "Playing Cards"],
  "Musica": [
    "Ancient Greek Musical Notation", "Byzantine Musical Symbols", "Musical Symbols", "Znamenny Musical Notation"
  ],
  "Compatibilidade_e_Apresentacao": [
    "Alphabetic Presentation Forms", "Arabic Presentation Forms-A", "Arabic Presentation Forms-B",
    "CJK Compatibility Ideographs", "CJK Compatibility Ideographs Supplement", "CJK Compatibility Forms",
    "CJK Compatibility", "Halfwidth and Fullwidth Forms", "Small Form Variants",
    "Variation Selectors", "Variation Selectors Supplement"
  ],
  "Surrogates": ["High Private Use Surrogates", "High Surrogates", "Low Surrogates"],
  "Uso_Privado": ["Private Use Area", "Supplementary Private Use Area-A", "Supplementary Private Use Area-B"],
  "Escritas": {
    "Componentes_e_Indices": [
      "CJK Radicals Supplement", "CJK Strokes", "Duployan", "Kana Extended-A", "Kana Extended-B",
      "Kana Supplement", "Kangxi Radicals", "Kanbun", "Khitan Small Script", "Tangut",
      "Tangut Components", "Tangut Components Supplement", "Tangut Supplement", "Yi Radicals", "Yijing Hexagram Symbols"
    ],
    "Historicas": [
      "Aegean Numbers", "Ancient Symbols", "Anatolian Hieroglyphs", "Carian", "Caucasian Albanian",
      "Chorasmian", "Coptic Epact Numbers", "Cuneiform", "Cuneiform Numbers and Punctuation",
      "Cypriot Syllabary", "Cypro-Minoan", "Egyptian Hieroglyph Format Controls",
      "Egyptian Hieroglyphs Extended-A", "Egyptian Hieroglyphs", "Elbasan", "Elymaic", "Gothic",
      "Hatran", "Imperial Aramaic", "Inscriptional Pahlavi", "Inscriptional Parthian", "Kharoshthi",
      "Linear A", "Linear B Ideograms", "Linear B Syllabary", "Lycian", "Lydian", "Manichaean",
      "Meroitic Cursive", "Meroitic Hieroglyphs", "Nabataean", "Old Hungarian", "Old Italic",
      "Old Permic", "Old Sogdian", "Old Turkic", "Old Uyghur", "Palmyrene", "Phaistos Disc",
      "Psalter Pahlavi", "Sidetic", "Sogdian", "Vithkuqi"
    ],
    "Modernas": [
      "Ahom", "Arabic Extended-C", "Avestan", "Balinese", "Bamum Supplement", "Bamum", "Bassa Vah",
      "Batak", "Beria Erfe", "Bhaiksuki", "Bopomofo Extended", "Bopomofo", "Buginese", "Buhid",
      "Chakma", "Cham", "Combining Half Marks", "Coptic", "Cyrillic Extended-D", "Dives Akuru",
      "Dogra", "Early Dynastic Cuneiform", "Ethiopic Extended-B", "Garay", "Glagolitic Supplement",
      "Glagolitic", "Gunjala Gondi", "Gurung Khema", "Hanifi Rohingya", "Hanunoo",
      "High Private Use Surrogates", "Hiragana", "Ideographic Description Characters", "Javanese",
      "Kayah Li", "Kawi", "Khmer", "Khudawadi", "Kirat Rai", "Lao", "Latin Extended Additional",
      "Latin Extended-F", "Latin Extended-G", "Letterlike Symbols", "Lepcha", "Limbu",
      "Lisu Supplement", "Lisu", "Makasar", "Mandaic", "Masaram Gondi", "Medefaidrin",
      "Meetei Mayek Extensions", "Meetei Mayek", "Mende Kikakui", "Miao", "Miscellaneous Symbols and Arrows",
      "Miscellaneous Technical", "Mro", "Myanmar Extended-C", "Nandinagari", "Nag Mundari",
      "New Tai Lue", "Newa", "Nyiakeng Puachue Hmong", "Ogham", "Ol Chiki", "Ol Onal",
      "Old North Arabian", "Old South Arabian", "Osage", "Osmanya", "Pahawh Hmong", "Pau Cin Hau",
      "Rejang", "Runic", "Samaritan", "Saurashtra", "Shavian", "Sora Sompeng", "Sundanese Supplement",
      "Sundanese", "Sunuwar", "Sutton SignWriting", "Syloti Nagri", "Tagalog", "Tagbanwa", "Tai Yo",
      "Takri", "Tangsa", "Thaana", "Tirhuta", "Todhri", "Tolong Siki", "Toto", "Tulu-Tigalari",
      "Unified Canadian Aboriginal Syllabics Extended-A", "Vai", "Wancho", "Warang Citi", "Yezidi",
      "Yi Syllables", "Zanabazar Square"
    ]
  }
};

// Latin transliterations for non-Latin scripts
export const transliterations = {
  // Greek alphabet
  "Greek and Coptic": {
    0x0391: "Alpha", 0x0392: "Beta", 0x0393: "Gamma", 0x0394: "Delta", 
    0x0395: "Epsilon", 0x0396: "Zeta", 0x0397: "Eta", 0x0398: "Theta",
    0x0399: "Iota", 0x039A: "Kappa", 0x039B: "Lambda", 0x039C: "Mu",
    0x039D: "Nu", 0x039E: "Xi", 0x039F: "Omicron", 0x03A0: "Pi",
    0x03A1: "Rho", 0x03A3: "Sigma", 0x03A4: "Tau", 0x03A5: "Upsilon",
    0x03A6: "Phi", 0x03A7: "Chi", 0x03A8: "Psi", 0x03A9: "Omega",
    0x03B1: "alpha", 0x03B2: "beta", 0x03B3: "gamma", 0x03B4: "delta",
    0x03B5: "epsilon", 0x03B6: "zeta", 0x03B7: "eta", 0x03B8: "theta",
    0x03B9: "iota", 0x03BA: "kappa", 0x03BB: "lambda", 0x03BC: "mu",
    0x03BD: "nu", 0x03BE: "xi", 0x03BF: "omicron", 0x03C0: "pi",
    0x03C1: "rho", 0x03C3: "sigma", 0x03C4: "tau", 0x03C5: "upsilon",
    0x03C6: "phi", 0x03C7: "chi", 0x03C8: "psi", 0x03C9: "omega"
  },
  // Cyrillic alphabet (Russian)
  "Cyrillic": {
    0x0410: "A", 0x0411: "B", 0x0412: "V", 0x0413: "G", 0x0414: "D",
    0x0415: "E", 0x0416: "Zh", 0x0417: "Z", 0x0418: "I", 0x0419: "Y",
    0x041A: "K", 0x041B: "L", 0x041C: "M", 0x041D: "N", 0x041E: "O",
    0x041F: "P", 0x0420: "R", 0x0421: "S", 0x0422: "T", 0x0423: "U",
    0x0424: "F", 0x0425: "Kh", 0x0426: "Ts", 0x0427: "Ch", 0x0428: "Sh",
    0x0429: "Shch", 0x042A: "\"", 0x042B: "Y", 0x042C: "'", 0x042D: "E",
    0x042E: "Yu", 0x042F: "Ya",
    0x0430: "a", 0x0431: "b", 0x0432: "v", 0x0433: "g", 0x0434: "d",
    0x0435: "e", 0x0436: "zh", 0x0437: "z", 0x0438: "i", 0x0439: "y",
    0x043A: "k", 0x043B: "l", 0x043C: "m", 0x043D: "n", 0x043E: "o",
    0x043F: "p", 0x0440: "r", 0x0441: "s", 0x0442: "t", 0x0443: "u",
    0x0444: "f", 0x0445: "kh", 0x0446: "ts", 0x0447: "ch", 0x0448: "sh",
    0x0449: "shch", 0x044A: "\"", 0x044B: "y", 0x044C: "'", 0x044D: "e",
    0x044E: "yu", 0x044F: "ya"
  },
  // Hebrew alphabet
  "Hebrew": {
    0x05D0: "Alef", 0x05D1: "Bet", 0x05D2: "Gimel", 0x05D3: "Dalet",
    0x05D4: "He", 0x05D5: "Vav", 0x05D6: "Zayin", 0x05D7: "Chet",
    0x05D8: "Tet", 0x05D9: "Yod", 0x05DA: "Kaf", 0x05DB: "Kaf",
    0x05DC: "Lamed", 0x05DD: "Mem", 0x05DE: "Mem", 0x05DF: "Nun",
    0x05E0: "Nun", 0x05E1: "Samekh", 0x05E2: "Ayin", 0x05E3: "Pe",
    0x05E4: "Pe", 0x05E5: "Tsade", 0x05E6: "Tsade", 0x05E7: "Qof",
    0x05E8: "Resh", 0x05E9: "Shin", 0x05EA: "Tav"
  },
  // Arabic alphabet
  "Arabic": {
    0x0627: "Alif", 0x0628: "Ba", 0x062A: "Ta", 0x062B: "Tha",
    0x062C: "Jim", 0x062D: "Ha", 0x062E: "Kha", 0x062F: "Dal",
    0x0630: "Dhal", 0x0631: "Ra", 0x0632: "Zay", 0x0633: "Sin",
    0x0634: "Shin", 0x0635: "Sad", 0x0636: "Dad", 0x0637: "Ta",
    0x0638: "Za", 0x0639: "Ayn", 0x063A: "Ghayn", 0x0641: "Fa",
    0x0642: "Qaf", 0x0643: "Kaf", 0x0644: "Lam", 0x0645: "Mim",
    0x0646: "Nun", 0x0647: "Ha", 0x0648: "Waw", 0x064A: "Ya"
  },
  // Japanese Hiragana
  "Hiragana": {
    0x3042: "a", 0x3044: "i", 0x3046: "u", 0x3048: "e", 0x304A: "o",
    0x304B: "ka", 0x304D: "ki", 0x304F: "ku", 0x3051: "ke", 0x3053: "ko",
    0x3055: "sa", 0x3057: "shi", 0x3059: "su", 0x305B: "se", 0x305D: "so",
    0x305F: "ta", 0x3061: "chi", 0x3064: "tsu", 0x3066: "te", 0x3068: "to",
    0x306A: "na", 0x306B: "ni", 0x306C: "nu", 0x306D: "ne", 0x306E: "no",
    0x306F: "ha", 0x3072: "hi", 0x3075: "fu", 0x3078: "he", 0x307B: "ho",
    0x307E: "ma", 0x307F: "mi", 0x3080: "mu", 0x3081: "me", 0x3082: "mo",
    0x3084: "ya", 0x3086: "yu", 0x3088: "yo",
    0x3089: "ra", 0x308A: "ri", 0x308B: "ru", 0x308C: "re", 0x308D: "ro",
    0x308F: "wa", 0x3092: "wo", 0x3093: "n"
  },
  // Japanese Katakana  
  "Katakana": {
    0x30A2: "a", 0x30A4: "i", 0x30A6: "u", 0x30A8: "e", 0x30AA: "o",
    0x30AB: "ka", 0x30AD: "ki", 0x30AF: "ku", 0x30B1: "ke", 0x30B3: "ko",
    0x30B5: "sa", 0x30B7: "shi", 0x30B9: "su", 0x30BB: "se", 0x30BD: "so",
    0x30BF: "ta", 0x30C1: "chi", 0x30C4: "tsu", 0x30C6: "te", 0x30C8: "to",
    0x30CA: "na", 0x30CB: "ni", 0x30CC: "nu", 0x30CD: "ne", 0x30CE: "no",
    0x30CF: "ha", 0x30D2: "hi", 0x30D5: "fu", 0x30D8: "he", 0x30DB: "ho",
    0x30DE: "ma", 0x30DF: "mi", 0x30E0: "mu", 0x30E1: "me", 0x30E2: "mo",
    0x30E4: "ya", 0x30E6: "yu", 0x30E8: "yo",
    0x30E9: "ra", 0x30EA: "ri", 0x30EB: "ru", 0x30EC: "re", 0x30ED: "ro",
    0x30EF: "wa", 0x30F2: "wo", 0x30F3: "n"
  },
  // Korean Hangul Compatibility Jamo
  "Hangul Compatibility Jamo": {
    // Consonants
    0x3131: "g", 0x3132: "gg", 0x3133: "gs", 0x3134: "n", 0x3135: "nj",
    0x3136: "nh", 0x3137: "d", 0x3138: "dd", 0x3139: "r", 0x313A: "rg",
    0x313B: "rm", 0x313C: "rb", 0x313D: "rs", 0x313E: "rt", 0x313F: "rp",
    0x3140: "rh", 0x3141: "m", 0x3142: "b", 0x3143: "bb", 0x3144: "bs",
    0x3145: "s", 0x3146: "ss", 0x3147: "ng", 0x3148: "j", 0x3149: "jj",
    0x314A: "ch", 0x314B: "k", 0x314C: "t", 0x314D: "p", 0x314E: "h",
    // Vowels
    0x314F: "a", 0x3150: "ae", 0x3151: "ya", 0x3152: "yae", 0x3153: "eo",
    0x3154: "e", 0x3155: "yeo", 0x3156: "ye", 0x3157: "o", 0x3158: "wa",
    0x3159: "wae", 0x315A: "oe", 0x315B: "yo", 0x315C: "u", 0x315D: "weo",
    0x315E: "we", 0x315F: "wi", 0x3160: "yu", 0x3161: "eu", 0x3162: "yi",
    0x3163: "i"
  }
};

// Base characters and their accented variants for long-press
export const accentedVariants = {
  'a': ['à', 'á', 'â', 'ã', 'ä', 'å', 'ā', 'ă', 'ą', 'ǎ', 'ȁ', 'ȃ', 'ạ', 'ả', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ', 'ª'],
  'A': ['À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Ā', 'Ă', 'Ą', 'Ǎ', 'Ȁ', 'Ȃ', 'Ạ', 'Ả', 'Ấ', 'Ầ', 'Ẩ', 'Ẫ', 'Ậ', 'Ắ', 'Ằ', 'Ẳ', 'Ẵ', 'Ặ'],
  'e': ['è', 'é', 'ê', 'ë', 'ē', 'ĕ', 'ė', 'ę', 'ě', 'ȅ', 'ȇ', 'ẹ', 'ẻ', 'ẽ', 'ế', 'ề', 'ể', 'ễ', 'ệ'],
  'E': ['È', 'É', 'Ê', 'Ë', 'Ē', 'Ĕ', 'Ė', 'Ę', 'Ě', 'Ȅ', 'Ȇ', 'Ẹ', 'Ẻ', 'Ẽ', 'Ế', 'Ề', 'Ể', 'Ễ', 'Ệ'],
  'i': ['ì', 'í', 'î', 'ï', 'ĩ', 'ī', 'ĭ', 'į', 'ǐ', 'ȉ', 'ȋ', 'ỉ', 'ị'],
  'I': ['Ì', 'Í', 'Î', 'Ï', 'Ĩ', 'Ī', 'Ĭ', 'Į', 'İ', 'Ǐ', 'Ȉ', 'Ȋ', 'Ỉ', 'Ị'],
  'o': ['ò', 'ó', 'ô', 'õ', 'ö', 'ø', 'ō', 'ŏ', 'ő', 'ǒ', 'ǫ', 'ǭ', 'ȍ', 'ȏ', 'ọ', 'ỏ', 'ố', 'ồ', 'ổ', 'ỗ', 'ộ', 'ớ', 'ờ', 'ở', 'ỡ', 'ợ', 'º'],
  'O': ['Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'Ø', 'Ō', 'Ŏ', 'Ő', 'Ǒ', 'Ǫ', 'Ǭ', 'Ȍ', 'Ȏ', 'Ọ', 'Ỏ', 'Ố', 'Ồ', 'Ổ', 'Ỗ', 'Ộ', 'Ớ', 'Ờ', 'Ở', 'Ỡ', 'Ợ'],
  'u': ['ù', 'ú', 'û', 'ü', 'ũ', 'ū', 'ŭ', 'ů', 'ű', 'ų', 'ǔ', 'ǖ', 'ǘ', 'ǚ', 'ǜ', 'ȕ', 'ȗ', 'ụ', 'ủ', 'ứ', 'ừ', 'ử', 'ữ', 'ự'],
  'U': ['Ù', 'Ú', 'Û', 'Ü', 'Ũ', 'Ū', 'Ŭ', 'Ů', 'Ű', 'Ų', 'Ǔ', 'Ǖ', 'Ǘ', 'Ǚ', 'Ǜ', 'Ȕ', 'Ȗ', 'Ụ', 'Ủ', 'Ứ', 'Ừ', 'Ử', 'Ữ', 'Ự'],
  'c': ['ç', 'ć', 'ĉ', 'ċ', 'č'],
  'C': ['Ç', 'Ć', 'Ĉ', 'Ċ', 'Č'],
  'n': ['ñ', 'ń', 'ņ', 'ň', 'ŉ', 'ǹ'],
  'N': ['Ñ', 'Ń', 'Ņ', 'Ň'],
  's': ['ś', 'ŝ', 'ş', 'š', 'ș', 'ß'],
  'S': ['Ś', 'Ŝ', 'Ş', 'Š', 'Ș'],
  'y': ['ý', 'ÿ', 'ŷ', 'ȳ', 'ỳ', 'ỵ', 'ỷ', 'ỹ'],
  'Y': ['Ý', 'Ÿ', 'Ŷ', 'Ȳ', 'Ỳ', 'Ỵ', 'Ỷ', 'Ỹ'],
  'z': ['ź', 'ż', 'ž'],
  'Z': ['Ź', 'Ż', 'Ž'],
  'd': ['ď', 'đ', 'ð'],
  'D': ['Ď', 'Đ', 'Ð'],
  'g': ['ĝ', 'ğ', 'ġ', 'ģ'],
  'G': ['Ĝ', 'Ğ', 'Ġ', 'Ģ'],
  'h': ['ĥ', 'ħ'],
  'H': ['Ĥ', 'Ħ'],
  'j': ['ĵ'],
  'J': ['Ĵ'],
  'k': ['ķ', 'ĸ'],
  'K': ['Ķ'],
  'l': ['ĺ', 'ļ', 'ľ', 'ŀ', 'ł'],
  'L': ['Ĺ', 'Ļ', 'Ľ', 'Ŀ', 'Ł'],
  'r': ['ŕ', 'ŗ', 'ř'],
  'R': ['Ŕ', 'Ŗ', 'Ř'],
  't': ['ţ', 'ť', 'ŧ', 'ț', 'þ'],
  'T': ['Ţ', 'Ť', 'Ŧ', 'Ț', 'Þ'],
  'w': ['ŵ', 'ẁ', 'ẃ', 'ẅ'],
  'W': ['Ŵ', 'Ẁ', 'Ẃ', 'Ẅ'],
  'æ': ['ǣ', 'ǽ'],
  'Æ': ['Ǣ', 'Ǽ'],
  '0': ['⁰', '₀', '⓪', '⓿'],
  '1': ['¹', '₁', '①', '❶', '⅟', '½', '⅓', '¼', '⅕', '⅙', '⅐', '⅛', '⅑', '⅒'],
  '2': ['²', '₂', '②', '❷', '⅔', '⅖'],
  '3': ['³', '₃', '③', '❸', '¾', '⅗', '⅜'],
  '4': ['⁴', '₄', '④', '❹', '⅘'],
  '5': ['⁵', '₅', '⑤', '❺', '⅚', '⅝'],
  '6': ['⁶', '₆', '⑥', '❻'],
  '7': ['⁷', '₇', '⑦', '❼', '⅞'],
  '8': ['⁸', '₈', '⑧', '❽'],
  '9': ['⁹', '₉', '⑨', '❾'],
  '+': ['±', '⁺', '₊'],
  '-': ['−', '–', '—', '⁻', '₋', '‐', '‑', '‒'],
  '=': ['≠', '≈', '≡', '≤', '≥', '⁼', '₌'],
  '/': ['÷', '⁄'],
  '*': ['×', '·', '•', '∗', '★', '☆'],
  '(': ['⁽', '₍', '❨', '❪', '﴾'],
  ')': ['⁾', '₎', '❩', '❫', '﴿'],
  '<': ['≤', '«', '‹', '⟨', '❮'],
  '>': ['≥', '»', '›', '⟩', '❯'],
  '!': ['¡', '‼', '❗', '❕'],
  '?': ['¿', '⁇', '⁈', '⁉', '❓', '❔'],
  '.': ['…', '·', '•', '‥'],
  ',': ['،', '、', '،'],
  ':': ['：', '∶'],
  ';': ['；'],
  '"': ['"', '"', '„', '‟', '«', '»'],
  "'": ['\u2018', '\u2019', '\u201A', '\u201B', '\u2032', '\u2033'],
  '&': ['＆'],
  '@': ['＠'],
  '#': ['№', '＃'],
  '%': ['‰', '‱', '％'],
  '$': ['¢', '£', '€', '¥', '₣', '₤', '₧', '₨', '₩', '₪', '₫', '₭', '₮', '₯', '₰', '₱', '₲', '₳', '₴', '₵', '₶', '₷', '₸', '₹', '₺', '₻', '₼', '₽', '₾', '₿'],
  '©': ['®', '™', '℗', '℠'],
  '°': ['′', '″', '‴', '⁗'],
  
  // Greek letters with variants (accents, breathing marks, alternative forms)
  // Lowercase
  'α': ['ά', 'ὰ', 'ᾶ', 'ἀ', 'ἁ', 'ἂ', 'ἃ', 'ἄ', 'ἅ', 'ἆ', 'ἇ', 'ᾀ', 'ᾁ', 'ᾂ', 'ᾃ', 'ᾄ', 'ᾅ', 'ᾆ', 'ᾇ', 'ᾲ', 'ᾳ', 'ᾴ', 'ᾷ'],
  'ε': ['έ', 'ὲ', 'ἐ', 'ἑ', 'ἒ', 'ἓ', 'ἔ', 'ἕ', 'ϵ'],
  'η': ['ή', 'ὴ', 'ῆ', 'ἠ', 'ἡ', 'ἢ', 'ἣ', 'ἤ', 'ἥ', 'ἦ', 'ἧ', 'ᾐ', 'ᾑ', 'ᾒ', 'ᾓ', 'ᾔ', 'ᾕ', 'ᾖ', 'ᾗ', 'ῂ', 'ῃ', 'ῄ', 'ῇ'],
  'ι': ['ί', 'ὶ', 'ῖ', 'ἰ', 'ἱ', 'ἲ', 'ἳ', 'ἴ', 'ἵ', 'ἶ', 'ἷ', 'ϊ', 'ΐ', 'ῒ', 'ῗ'],
  'ο': ['ό', 'ὸ', 'ὀ', 'ὁ', 'ὂ', 'ὃ', 'ὄ', 'ὅ'],
  'υ': ['ύ', 'ὺ', 'ῦ', 'ὐ', 'ὑ', 'ὒ', 'ὓ', 'ὔ', 'ὕ', 'ὖ', 'ὗ', 'ϋ', 'ΰ', 'ῢ', 'ῧ'],
  'ω': ['ώ', 'ὼ', 'ῶ', 'ὠ', 'ὡ', 'ὢ', 'ὣ', 'ὤ', 'ὥ', 'ὦ', 'ὧ', 'ᾠ', 'ᾡ', 'ᾢ', 'ᾣ', 'ᾤ', 'ᾥ', 'ᾦ', 'ᾧ', 'ῲ', 'ῳ', 'ῴ', 'ῷ'],
  'ρ': ['ῤ', 'ῥ', 'ϱ'],
  'θ': ['ϑ'],
  'φ': ['ϕ'],
  'π': ['ϖ'],
  'κ': ['ϰ'],
  'σ': ['ς', 'ϲ'],
  'β': ['ϐ'],
  
  // Uppercase
  'Α': ['Ά', 'Ὰ', 'Ἀ', 'Ἁ', 'Ἂ', 'Ἃ', 'Ἄ', 'Ἅ', 'Ἆ', 'Ἇ', 'ᾈ', 'ᾉ', 'ᾊ', 'ᾋ', 'ᾌ', 'ᾍ', 'ᾎ', 'ᾏ'],
  'Ε': ['Έ', 'Ὲ', 'Ἐ', 'Ἑ', 'Ἒ', 'Ἓ', 'Ἔ', 'Ἕ'],
  'Η': ['Ή', 'Ὴ', 'Ἠ', 'Ἡ', 'Ἢ', 'Ἣ', 'Ἤ', 'Ἥ', 'Ἦ', 'Ἧ', 'ᾘ', 'ᾙ', 'ᾚ', 'ᾛ', 'ᾜ', 'ᾝ', 'ᾞ', 'ᾟ'],
  'Ι': ['Ί', 'Ὶ', 'Ἰ', 'Ἱ', 'Ἲ', 'Ἳ', 'Ἴ', 'Ἵ', 'Ἶ', 'Ἷ', 'Ϊ'],
  'Ο': ['Ό', 'Ὸ', 'Ὀ', 'Ὁ', 'Ὂ', 'Ὃ', 'Ὄ', 'Ὅ'],
  'Υ': ['Ύ', 'Ὺ', 'Ὑ', 'Ὓ', 'Ὕ', 'Ὗ', 'Ϋ'],
  'Ω': ['Ώ', 'Ὼ', 'Ὠ', 'Ὡ', 'Ὢ', 'Ὣ', 'Ὤ', 'Ὥ', 'Ὦ', 'Ὧ', 'ᾨ', 'ᾩ', 'ᾪ', 'ᾫ', 'ᾬ', 'ᾭ', 'ᾮ', 'ᾯ'],
  'Ρ': ['Ῥ']
};

// Layout orders for Latin keyboards
// Keyboard layouts with row structure for visual line breaks
export const keyboardLayouts = {
  // Classic layouts
  qwerty: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'],
  azerty: ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'w', 'x', 'c', 'v', 'b', 'n'],
  qwertz: ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'y', 'x', 'c', 'v', 'b', 'n', 'm'],
  alphabetic: 'abcdefghijklmnopqrstuvwxyz'.split(''),
  
  // National layouts
  'qwerty-pt': ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ç', 'z', 'x', 'c', 'v', 'b', 'n', 'm'],
  'abnt2': ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ç', 'z', 'x', 'c', 'v', 'b', 'n', 'm'],
  'bepo': ['b', 'é', 'p', 'o', 'è', 'v', 'd', 'l', 'j', 'z', 'a', 'u', 'i', 'e', 'c', 't', 's', 'r', 'n', 'm', 'à', 'y', 'x', 'k', 'q', 'g', 'h', 'f', 'w'],
  
  // Ergonomic layouts
  dvorak: ['p', 'y', 'f', 'g', 'c', 'r', 'l', 'a', 'o', 'e', 'u', 'i', 'd', 'h', 't', 'n', 's', 'q', 'j', 'k', 'x', 'b', 'm', 'w', 'v', 'z'],
  colemak: ['q', 'w', 'f', 'p', 'g', 'j', 'l', 'u', 'y', 'a', 'r', 's', 't', 'd', 'h', 'n', 'e', 'i', 'o', 'z', 'x', 'c', 'v', 'b', 'k', 'm'],
  workman: ['q', 'd', 'r', 'w', 'b', 'j', 'f', 'u', 'p', 'a', 's', 'h', 't', 'g', 'y', 'n', 'e', 'o', 'i', 'z', 'x', 'm', 'c', 'v', 'k', 'l']
};

// Row structure for layouts that should have line breaks
export const keyboardRows = {
  qwerty: [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ],
  azerty: [
    ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm'],
    ['w', 'x', 'c', 'v', 'b', 'n']
  ],
  qwertz: [
    ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['y', 'x', 'c', 'v', 'b', 'n', 'm']
  ],
  'qwerty-pt': [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ç'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ],
  'abnt2': [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ç'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ],
  'bepo': [
    ['b', 'é', 'p', 'o', 'è', 'v', 'd', 'l', 'j', 'z'],
    ['a', 'u', 'i', 'e', 'c', 't', 's', 'r', 'n', 'm'],
    ['à', 'y', 'x', 'k', 'q', 'g', 'h', 'f', 'w']
  ],
  dvorak: [
    ['p', 'y', 'f', 'g', 'c', 'r', 'l'],
    ['a', 'o', 'e', 'u', 'i', 'd', 'h', 't', 'n', 's'],
    ['q', 'j', 'k', 'x', 'b', 'm', 'w', 'v', 'z']
  ],
  colemak: [
    ['q', 'w', 'f', 'p', 'g', 'j', 'l', 'u', 'y'],
    ['a', 'r', 's', 't', 'd', 'h', 'n', 'e', 'i', 'o'],
    ['z', 'x', 'c', 'v', 'b', 'k', 'm']
  ],
  workman: [
    ['q', 'd', 'r', 'w', 'b', 'j', 'f', 'u', 'p'],
    ['a', 's', 'h', 't', 'g', 'y', 'n', 'e', 'o', 'i'],
    ['z', 'x', 'm', 'c', 'v', 'k', 'l']
  ]
};

// Get characters from a Unicode block (optionally limited for performance)
export function getBlockCharacters(blockName, limit = Infinity) {
  const block = unicodeBlocks[blockName];
  if (!block) return [];
  
  const chars = [];
  for (let code = block.start; code <= block.end && chars.length < limit; code++) {
    try {
      const char = String.fromCodePoint(code);
      // Skip control characters and unassigned
      if (isPrintable(code)) {
        chars.push({ code, char });
      }
    } catch (e) {
      // Invalid codepoint
    }
  }
  return chars;
}

// Check if codepoint is printable
function isPrintable(code) {
  // Skip control characters (C0, C1, DEL)
  if (code < 0x20) return false;
  if (code >= 0x7F && code <= 0x9F) return false;
  // Skip surrogates
  if (code >= 0xD800 && code <= 0xDFFF) return false;
  // Skip private use (optional)
  // if (code >= 0xE000 && code <= 0xF8FF) return false;
  return true;
}

// Get transliteration for a codepoint in a block
export function getTransliteration(blockName, code) {
  const blockTranslit = transliterations[blockName];
  if (blockTranslit && blockTranslit[code]) {
    return blockTranslit[code];
  }
  return null;
}
