import type { Phrase } from "./types.ts";

/** Reviewed MVP content; keep docs/content.md in sync when editing. */
export const phrases: readonly Phrase[] = [
  {
    "id": "p01",
    "category": "ask",
    "vietnamese": "Em đang bận à?",
    "pinyin": "nǐ zài máng ma",
    "keyboardInput": "ni zai mang ma",
    "hanzi": "你在忙吗？",
    "words": [
      {
        "pinyin": "nǐ",
        "hanzi": "你",
        "meaning": "em, bạn."
      },
      {
        "pinyin": "zài",
        "hanzi": "在",
        "meaning": "đang."
      },
      {
        "pinyin": "máng",
        "hanzi": "忙",
        "meaning": "bận."
      },
      {
        "pinyin": "ma",
        "hanzi": "吗",
        "meaning": "trợ từ hỏi có/không."
      }
    ],
    "distractorIds": [
      "p02",
      "p04"
    ]
  },
  {
    "id": "p02",
    "category": "ask",
    "vietnamese": "Em đang làm việc à?",
    "pinyin": "nǐ zài gōngzuò ma",
    "keyboardInput": "ni zai gongzuo ma",
    "hanzi": "你在工作吗？",
    "words": [
      {
        "pinyin": "nǐ",
        "hanzi": "你",
        "meaning": "em."
      },
      {
        "pinyin": "zài",
        "hanzi": "在",
        "meaning": "đang."
      },
      {
        "pinyin": "gōngzuò",
        "hanzi": "工作",
        "meaning": "làm việc."
      },
      {
        "pinyin": "ma",
        "hanzi": "吗",
        "meaning": "trợ từ hỏi."
      }
    ],
    "distractorIds": [
      "p01",
      "p04"
    ]
  },
  {
    "id": "p03",
    "category": "ask",
    "vietnamese": "Em đang ở nhà à?",
    "pinyin": "nǐ zài jiā ma",
    "keyboardInput": "ni zai jia ma",
    "hanzi": "你在家吗？",
    "words": [
      {
        "pinyin": "nǐ",
        "hanzi": "你",
        "meaning": "em."
      },
      {
        "pinyin": "zài",
        "hanzi": "在",
        "meaning": "ở."
      },
      {
        "pinyin": "jiā",
        "hanzi": "家",
        "meaning": "nhà."
      },
      {
        "pinyin": "ma",
        "hanzi": "吗",
        "meaning": "trợ từ hỏi."
      }
    ],
    "distractorIds": [
      "p02",
      "p04"
    ]
  },
  {
    "id": "p04",
    "category": "ask",
    "vietnamese": "Em đang ăn cơm à?",
    "pinyin": "nǐ zài chīfàn ma",
    "keyboardInput": "ni zai chifan ma",
    "hanzi": "你在吃饭吗？",
    "words": [
      {
        "pinyin": "nǐ",
        "hanzi": "你",
        "meaning": "em."
      },
      {
        "pinyin": "zài",
        "hanzi": "在",
        "meaning": "đang."
      },
      {
        "pinyin": "chīfàn",
        "hanzi": "吃饭",
        "meaning": "ăn cơm, ăn bữa."
      },
      {
        "pinyin": "ma",
        "hanzi": "吗",
        "meaning": "trợ từ hỏi."
      }
    ],
    "distractorIds": [
      "p01",
      "p02"
    ]
  },
  {
    "id": "p05",
    "category": "ask",
    "vietnamese": "Em ăn cơm chưa?",
    "pinyin": "nǐ chīfàn le ma",
    "keyboardInput": "ni chifan le ma",
    "hanzi": "你吃饭了吗？",
    "words": [
      {
        "pinyin": "nǐ",
        "hanzi": "你",
        "meaning": "em."
      },
      {
        "pinyin": "chīfàn",
        "hanzi": "吃饭",
        "meaning": "ăn cơm."
      },
      {
        "pinyin": "le",
        "hanzi": "了",
        "meaning": "ở đây giúp hỏi việc đã xảy ra chưa."
      },
      {
        "pinyin": "ma",
        "hanzi": "吗",
        "meaning": "trợ từ hỏi."
      }
    ],
    "distractorIds": [
      "p06",
      "p07"
    ]
  },
  {
    "id": "p06",
    "category": "ask",
    "vietnamese": "Em về đến nhà chưa?",
    "pinyin": "nǐ dào jiā le ma",
    "keyboardInput": "ni dao jia le ma",
    "hanzi": "你到家了吗？",
    "words": [
      {
        "pinyin": "nǐ",
        "hanzi": "你",
        "meaning": "em."
      },
      {
        "pinyin": "dào",
        "hanzi": "到",
        "meaning": "đến."
      },
      {
        "pinyin": "jiā",
        "hanzi": "家",
        "meaning": "nhà."
      },
      {
        "pinyin": "le",
        "hanzi": "了",
        "meaning": "ở đây giúp hỏi việc đã xảy ra chưa."
      },
      {
        "pinyin": "ma",
        "hanzi": "吗",
        "meaning": "trợ từ hỏi."
      }
    ],
    "distractorIds": [
      "p05",
      "p07"
    ]
  },
  {
    "id": "p07",
    "category": "ask",
    "vietnamese": "Em tan làm chưa?",
    "pinyin": "nǐ xiàbān le ma",
    "keyboardInput": "ni xiaban le ma",
    "hanzi": "你下班了吗？",
    "words": [
      {
        "pinyin": "nǐ",
        "hanzi": "你",
        "meaning": "em."
      },
      {
        "pinyin": "xiàbān",
        "hanzi": "下班",
        "meaning": "tan làm."
      },
      {
        "pinyin": "le",
        "hanzi": "了",
        "meaning": "ở đây giúp hỏi việc đã xảy ra chưa."
      },
      {
        "pinyin": "ma",
        "hanzi": "吗",
        "meaning": "trợ từ hỏi."
      }
    ],
    "distractorIds": [
      "p05",
      "p06"
    ]
  },
  {
    "id": "p08",
    "category": "ask",
    "vietnamese": "Em mệt không?",
    "pinyin": "nǐ lèi ma",
    "keyboardInput": "ni lei ma",
    "hanzi": "你累吗？",
    "words": [
      {
        "pinyin": "nǐ",
        "hanzi": "你",
        "meaning": "em."
      },
      {
        "pinyin": "lèi",
        "hanzi": "累",
        "meaning": "mệt."
      },
      {
        "pinyin": "ma",
        "hanzi": "吗",
        "meaning": "trợ từ hỏi."
      }
    ],
    "distractorIds": [
      "p09",
      "p10"
    ]
  },
  {
    "id": "p09",
    "category": "ask",
    "vietnamese": "Em đói không?",
    "pinyin": "nǐ è ma",
    "keyboardInput": "ni e ma",
    "hanzi": "你饿吗？",
    "words": [
      {
        "pinyin": "nǐ",
        "hanzi": "你",
        "meaning": "em."
      },
      {
        "pinyin": "è",
        "hanzi": "饿",
        "meaning": "đói."
      },
      {
        "pinyin": "ma",
        "hanzi": "吗",
        "meaning": "trợ từ hỏi."
      }
    ],
    "distractorIds": [
      "p08",
      "p10"
    ]
  },
  {
    "id": "p10",
    "category": "ask",
    "vietnamese": "Em nhớ anh không?",
    "pinyin": "nǐ xiǎng wǒ ma",
    "keyboardInput": "ni xiang wo ma",
    "hanzi": "你想我吗？",
    "words": [
      {
        "pinyin": "nǐ",
        "hanzi": "你",
        "meaning": "em."
      },
      {
        "pinyin": "xiǎng",
        "hanzi": "想",
        "meaning": "nhớ trong câu này."
      },
      {
        "pinyin": "wǒ",
        "hanzi": "我",
        "meaning": "anh, tôi."
      },
      {
        "pinyin": "ma",
        "hanzi": "吗",
        "meaning": "trợ từ hỏi."
      }
    ],
    "distractorIds": [
      "p08",
      "p09"
    ]
  },
  {
    "id": "p11",
    "category": "update",
    "vietnamese": "Anh đang trên đường đi làm.",
    "pinyin": "wǒ zài qù shàngbān de lùshang",
    "keyboardInput": "wo zai qu shangban de lushang",
    "hanzi": "我在去上班的路上。",
    "words": [
      {
        "pinyin": "wǒ",
        "hanzi": "我",
        "meaning": "anh."
      },
      {
        "pinyin": "zài",
        "hanzi": "在",
        "meaning": "ở, đang ở."
      },
      {
        "pinyin": "qù",
        "hanzi": "去",
        "meaning": "đi."
      },
      {
        "pinyin": "shàngbān",
        "hanzi": "上班",
        "meaning": "đi làm."
      },
      {
        "pinyin": "de",
        "hanzi": "的",
        "meaning": "nối cụm bổ nghĩa."
      },
      {
        "pinyin": "lùshang",
        "hanzi": "路上",
        "meaning": "trên đường."
      }
    ],
    "distractorIds": [
      "p12",
      "p13"
    ]
  },
  {
    "id": "p12",
    "category": "update",
    "vietnamese": "Anh đang làm việc.",
    "pinyin": "wǒ zài gōngzuò",
    "keyboardInput": "wo zai gongzuo",
    "hanzi": "我在工作。",
    "words": [
      {
        "pinyin": "wǒ",
        "hanzi": "我",
        "meaning": "anh."
      },
      {
        "pinyin": "zài",
        "hanzi": "在",
        "meaning": "đang."
      },
      {
        "pinyin": "gōngzuò",
        "hanzi": "工作",
        "meaning": "làm việc."
      }
    ],
    "distractorIds": [
      "p13",
      "p14"
    ]
  },
  {
    "id": "p13",
    "category": "update",
    "vietnamese": "Anh đang trên đường về nhà.",
    "pinyin": "wǒ zài huí jiā de lùshang",
    "keyboardInput": "wo zai hui jia de lushang",
    "hanzi": "我在回家的路上。",
    "words": [
      {
        "pinyin": "wǒ",
        "hanzi": "我",
        "meaning": "anh."
      },
      {
        "pinyin": "zài",
        "hanzi": "在",
        "meaning": "ở, đang ở."
      },
      {
        "pinyin": "huí",
        "hanzi": "回",
        "meaning": "về."
      },
      {
        "pinyin": "jiā",
        "hanzi": "家",
        "meaning": "nhà."
      },
      {
        "pinyin": "de",
        "hanzi": "的",
        "meaning": "nối cụm bổ nghĩa."
      },
      {
        "pinyin": "lùshang",
        "hanzi": "路上",
        "meaning": "trên đường."
      }
    ],
    "distractorIds": [
      "p11",
      "p12"
    ]
  },
  {
    "id": "p14",
    "category": "update",
    "vietnamese": "Anh đang ăn cơm.",
    "pinyin": "wǒ zài chīfàn",
    "keyboardInput": "wo zai chifan",
    "hanzi": "我在吃饭。",
    "words": [
      {
        "pinyin": "wǒ",
        "hanzi": "我",
        "meaning": "anh."
      },
      {
        "pinyin": "zài",
        "hanzi": "在",
        "meaning": "đang."
      },
      {
        "pinyin": "chīfàn",
        "hanzi": "吃饭",
        "meaning": "ăn cơm, ăn bữa."
      }
    ],
    "distractorIds": [
      "p12",
      "p15"
    ]
  },
  {
    "id": "p15",
    "category": "update",
    "vietnamese": "Anh đang bận.",
    "pinyin": "wǒ zài máng",
    "keyboardInput": "wo zai mang",
    "hanzi": "我在忙。",
    "words": [
      {
        "pinyin": "wǒ",
        "hanzi": "我",
        "meaning": "anh."
      },
      {
        "pinyin": "zài",
        "hanzi": "在",
        "meaning": "đang."
      },
      {
        "pinyin": "máng",
        "hanzi": "忙",
        "meaning": "bận."
      }
    ],
    "distractorIds": [
      "p12",
      "p14"
    ]
  },
  {
    "id": "p16",
    "category": "update",
    "vietnamese": "Anh về đến nhà rồi.",
    "pinyin": "wǒ dào jiā le",
    "keyboardInput": "wo dao jia le",
    "hanzi": "我到家了。",
    "words": [
      {
        "pinyin": "wǒ",
        "hanzi": "我",
        "meaning": "anh."
      },
      {
        "pinyin": "dào",
        "hanzi": "到",
        "meaning": "đến."
      },
      {
        "pinyin": "jiā",
        "hanzi": "家",
        "meaning": "nhà."
      },
      {
        "pinyin": "le",
        "hanzi": "了",
        "meaning": "rồi trong câu này."
      }
    ],
    "distractorIds": [
      "p17",
      "p18"
    ]
  },
  {
    "id": "p17",
    "category": "update",
    "vietnamese": "Anh tan làm rồi.",
    "pinyin": "wǒ xiàbān le",
    "keyboardInput": "wo xiaban le",
    "hanzi": "我下班了。",
    "words": [
      {
        "pinyin": "wǒ",
        "hanzi": "我",
        "meaning": "anh."
      },
      {
        "pinyin": "xiàbān",
        "hanzi": "下班",
        "meaning": "tan làm."
      },
      {
        "pinyin": "le",
        "hanzi": "了",
        "meaning": "rồi trong câu này."
      }
    ],
    "distractorIds": [
      "p16",
      "p18"
    ]
  },
  {
    "id": "p18",
    "category": "update",
    "vietnamese": "Anh ăn cơm rồi.",
    "pinyin": "wǒ chīfàn le",
    "keyboardInput": "wo chifan le",
    "hanzi": "我吃饭了。",
    "words": [
      {
        "pinyin": "wǒ",
        "hanzi": "我",
        "meaning": "anh."
      },
      {
        "pinyin": "chīfàn",
        "hanzi": "吃饭",
        "meaning": "ăn cơm."
      },
      {
        "pinyin": "le",
        "hanzi": "了",
        "meaning": "rồi trong câu này."
      }
    ],
    "distractorIds": [
      "p16",
      "p17"
    ]
  },
  {
    "id": "p19",
    "category": "update",
    "vietnamese": "Anh nhớ em.",
    "pinyin": "wǒ xiǎng nǐ",
    "keyboardInput": "wo xiang ni",
    "hanzi": "我想你。",
    "words": [
      {
        "pinyin": "wǒ",
        "hanzi": "我",
        "meaning": "anh."
      },
      {
        "pinyin": "xiǎng",
        "hanzi": "想",
        "meaning": "nhớ trong câu này."
      },
      {
        "pinyin": "nǐ",
        "hanzi": "你",
        "meaning": "em."
      }
    ],
    "distractorIds": [
      "p12",
      "p15"
    ]
  },
  {
    "id": "p20",
    "category": "update",
    "vietnamese": "Anh đi ngủ đây.",
    "pinyin": "wǒ qù shuìjiào le",
    "keyboardInput": "wo qu shuijiao le",
    "hanzi": "我去睡觉了。",
    "words": [
      {
        "pinyin": "wǒ",
        "hanzi": "我",
        "meaning": "anh."
      },
      {
        "pinyin": "qù",
        "hanzi": "去",
        "meaning": "đi."
      },
      {
        "pinyin": "shuìjiào",
        "hanzi": "睡觉",
        "meaning": "ngủ."
      },
      {
        "pinyin": "le",
        "hanzi": "了",
        "meaning": "ở đây báo chuyển sang hành động mới."
      }
    ],
    "distractorIds": [
      "p17",
      "p18"
    ]
  }
];
