﻿using InWords.Data;
using InWords.Data.Creations;
using InWords.Data.Creations.GameBox;
using InWords.Protobuf;
using InWords.WebApi.Modules.WordsSets;
using InWords.WebApi.Services.Abstractions;
using InWords.WebApiTests.TestUtils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Xunit;
using static InWords.Protobuf.TrainingDataRequest.Types;
using static InWords.Protobuf.TrainingDataRequest.Types.Training.Types;

namespace InWords.WebApiTests.Moduls.WordsSets
{
    public class EstimateTrainingTests
    {
        [Fact]
        public async void EstimateCardGame_Returns3Stars()
        {
            // arrange
            int userId = 1;
            using InWordsDataContext context = InWordsDataContextFactory.Create();
            Game game = new Game() { };
            context.Add(game);
            context.SaveChanges();
            GameLevel gameLevel = new GameLevel() { GameId = game.GameId };
            context.Add(gameLevel);
            context.SaveChanges();
            await context.AddAccount(userId);
            await context.SaveChangesAsync();

            // act
            TrainingDataRequest trainingDataRequest = new TrainingDataRequest();
            Training training = new Training { GameLevelId = 1 };
            training.CardsMetric = new CardsMetric();
            training.CardsMetric.WordIdOpenCount.Add(1, 4);
            training.CardsMetric.WordIdOpenCount.Add(2, 4);
            training.CardsMetric.WordIdOpenCount.Add(3, 2);
            trainingDataRequest.Metrics.Add(training);

            var requestData = new AuthorizedRequestObject<TrainingDataRequest, TrainingScoreReply>(trainingDataRequest)
            {
                UserId = userId
            };
            var requestHandler = new EstimateTraining(context);
            var result = await requestHandler.Handle(requestData);
            // assert
            Assert.Single(result.Scores);
            Assert.Equal(6, result.Scores.First().CardsStatus.Score);
            Assert.Equal(6, result.Scores.First().Score);
        }

        [Fact]
        public async void EstimateAudioGame_Returns2Stars()
        {
            // arrange
            int userId = 1;
            using InWordsDataContext context = InWordsDataContextFactory.Create();
            Game game = new Game() { };
            context.Add(game);
            context.SaveChanges();
            GameLevel gameLevel = new GameLevel() { GameId = game.GameId };
            context.Add(gameLevel);
            context.SaveChanges();
            await context.AddAccount(userId);
            await context.SaveChangesAsync();

            // act
            TrainingDataRequest trainingDataRequest = new TrainingDataRequest();
            Training training = new Training { GameLevelId = 1 };
            training.AuditionMetric = new AuditionMetric();
            training.AuditionMetric.WordIdOpenCount.Add(1, 2);
            training.AuditionMetric.WordIdOpenCount.Add(2, 1);
            training.AuditionMetric.WordIdOpenCount.Add(3, 1);
            trainingDataRequest.Metrics.Add(training);

            var requestData = new AuthorizedRequestObject<TrainingDataRequest, TrainingScoreReply>(trainingDataRequest)
            {
                UserId = userId
            };
            var requestHandler = new EstimateTraining(context);
            var result = await requestHandler.Handle(requestData);
            // assert
            Assert.Single(result.Scores);
            Assert.Equal(5, result.Scores.First().AuditionStatus.Score);
            Assert.Equal(5, result.Scores.First().Score);
        }
    }
}