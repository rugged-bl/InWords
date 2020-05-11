﻿using Grpc.Core;
using InWords.Data;
using InWords.Protobuf;
using InWords.WebApi.Modules.Profile.Extentions;
using InWords.WebApi.Services;
using InWords.WebApi.Services.Abstractions;
using InWords.WebApi.Services.Localization;
using InWords.WebApiTests.TestUtils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace InWords.WebApi.Modules.Profile.PublicData
{
    public class FindProfileNicknameTests
    {
        [Fact]
        public async void Find_Existed_Account()
        {
            // arrange
            int userId = 1;
            string nickname = "nick";

            int other = 2;
            await using InWordsDataContext context = InWordsDataContextFactory.Create();
            await context.AddAccount(userId);
            await context.SaveChangesAsync();
            context.Users.First().NickName = nickname;
            context.SaveChanges();


            // act
            var requestData = new FindUsernameRequest()
            {
                UserName = nickname
            };
            var request = new AuthorizedRequestObject<FindUsernameRequest, PublicProfilesReply>(requestData)
            {
                UserId = other,
            };
            var handler = new FindProfileNickname(context);
            var result = await handler.Handle(request);

            // assert
            Assert.Equal(userId, result.Users.First().UserId);
        }
    }
}
