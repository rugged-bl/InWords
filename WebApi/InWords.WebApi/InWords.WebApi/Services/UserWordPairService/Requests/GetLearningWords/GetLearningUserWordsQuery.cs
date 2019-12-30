﻿using System.Collections.Generic;
using InWords.Data.DTO;
using MediatR;

namespace InWords.WebApi.Services.UserWordPairService.Requests.GetLearningWords
{
    public class GetLearningUserWordsQuery : IRequest<List<WordTranslation>>
    {
        public int DaysForward { get; set; } = 1;
        public int UserId { get; set; }
        public GetLearningUserWordsQuery(int userId)
        {
            UserId = userId;
        }
    }
}