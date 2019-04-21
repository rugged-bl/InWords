﻿using InWords.Transfer.Data.Models;
using InWords.Transfer.Data.Models.GameBox;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InWords.WebApi.Services.Abstractions
{
    public interface IGameService
    {
        Task<SyncBase> AddGamePack(int userId, GamePack gamePack);
        List<GameInfo> GetGames();
        Task<GameObject> GetGameObject(int gameId);
        Level GetLevelWords(int userId, int levelId);
        Task<int> DeleteGames(params int[] gameId);
        Task<int> DeleteOwnGames(int userId, params int[] gameId);
    }
}
