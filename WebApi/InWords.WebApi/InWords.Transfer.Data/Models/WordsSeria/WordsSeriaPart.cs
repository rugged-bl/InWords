﻿using System;
using System.Collections.Generic;
using System.Text;

namespace InWords.Transfer.Data
{
    public class WordsSeriaPart : WordTranslation
    {
        ///public int Id
        ///public string WordForeign
        ///public string WordNative
        ///public int ServerId

        public int SeriaID { get; set; }

        public int Level { get; set; }

        public WordsSeriaPart(WordTranslation wordTranslation) : base(wordTranslation)
        {
            //base Id = onClientID; ServerId = serverID;
        }
    }
}
