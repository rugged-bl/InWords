﻿using System;

namespace InWords.Data.DTO.GameBox.LevelMetric
{
    [Obsolete]
    public class LevelMetricQueryResult
    {
        public LevelMetricQueryResult(int levelId, int score)
        {
            LevelId = levelId;
            Score = score;
        }

        public int LevelId { get; set; }

        public int Score { get; set; }
    }
}