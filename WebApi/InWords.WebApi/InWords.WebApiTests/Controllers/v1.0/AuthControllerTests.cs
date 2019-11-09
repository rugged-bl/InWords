﻿using System;
using System.Collections.Generic;
using System.Text;
using InWords.Data;
using InWords.Data.Repositories;
using InWords.WebApi.Controllers.v1;
using InWords.WebApi.Services.Email;
using Microsoft.EntityFrameworkCore;

namespace InWords.WebApiTests.Controllers.v1._0
{

    public class AuthControllerTests
    {
        public static AuthController Create()
        {
            var context = InWordsDataContextFactory.Create();
            return new AuthController(new AccountRepository(context),new UserRepository(context),null );
        }
    }

    public static class InWordsDataContextFactory
    {
        public static InWordsDataContext Create()
        {
            var options = new DbContextOptionsBuilder<InWordsDataContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            // Run the test against one instance of the context
            return new InWordsDataContext(options);
        }
    }
}
