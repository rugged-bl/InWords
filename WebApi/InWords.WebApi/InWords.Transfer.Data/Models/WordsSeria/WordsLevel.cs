﻿namespace InWords.Transfer.Data
{
    using System;
    using System.Collections.Generic;
    using System.Text;

    public class WordsLevel
    {
        public int Level { get; set; }

        public List<WordTranslation> WordTranslations { get; set; }
    }
}
