﻿using Grpc.Core;
using InWords.Protobuf;
using InWords.WebApi.Extensions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace InWords.WebApi.Controllers.v2
{
    [Authorize]
    [ApiVersion("2")]
    [Route("v{version:apiVersion}/ClassicCardGame")]
    [ApiController]
    [Produces("application/json")]
    public class ClassicCardGameController : Controller
    {
        private readonly IMediator mediator;
        public ClassicCardGameController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost]
        [Route("estimate")]
        [ProducesResponseType(typeof(LevelPoints), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Status), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Estimate(CardGameMetrics request)
        {
            var (reply, status) = await mediator
                .AuthorizeHandler<CardGameMetrics, LevelPoints>(request, User)
                .ConfigureAwait(false);

            if (status.StatusCode == Grpc.Core.StatusCode.OK)
                return Ok(reply);

            return BadRequest(status);
        }
    }
}
