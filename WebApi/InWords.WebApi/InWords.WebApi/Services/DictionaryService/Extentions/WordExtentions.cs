﻿using InWords.Common.Extensions;
using InWords.Data.Domains;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InWords.WebApi.Services.DictionaryService.Extentions
{
    public static class WordExtentions
    {
        public static void AddWords(this DbSet<Word> words, IEnumerable<Word> resource)
        {
            if (words == null)
                throw new ArgumentNullException($"{nameof(words)} is null");

            resource.ForEach(r => r.Content = r.Content.ToLower());

            // this is to cast content in array to use in SQL request
            var contentDictionary = (from word in resource
                                     group word by word.Content into wordsContent
                                     select wordsContent).ToDictionary(wc => wc.Key, wk => wk.First());

            // use keys as string array to perform translation to sql query
            var existedWords = words.Where(w => contentDictionary.Keys.Any(d => d.Equals(w.Content))).ToList();

            existedWords.ForEach(word =>
            {
                contentDictionary[word.Content].WordId = word.WordId;
            });



            var wordsToAdd = contentDictionary.Where(d => existedWords.All(w => w.Content != d.Key)).Select(d => d.Value);

            words.AddRange(wordsToAdd);
        }
    }
}
