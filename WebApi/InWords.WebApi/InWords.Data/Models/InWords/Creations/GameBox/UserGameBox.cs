﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using InWords.Data.Models.InWords.Domains;

namespace InWords.Data.Models.InWords.Creations.GameBox
{
    public class UserGameBox
    {
        [Key] public int UserGameBoxId { get; set; }

        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))] public virtual User User { get; set; }

        public int GameBoxId { get; set; }

        [ForeignKey(nameof(GameBoxId))] public virtual GameBox GameBox { get; set; }

        #region Ctor

        public UserGameBox(int userId, int gameBoxId, int userGameBoxId = 0)
        {
            UserId = userId;
            GameBoxId = gameBoxId;
            UserGameBoxId = userGameBoxId;
        }

        #endregion
    }
}