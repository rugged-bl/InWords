﻿using Autofac.Extensions.DependencyInjection;
using InWords.WebApi.Module;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Hosting;
using Serilog;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Net;

namespace InWords.WebApi.AppStart
{
    public static class Program
    {
        public static IList<InModule> InModules = InModule.FindModules();
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateWebHostBuilder(string[] args)
        {
            return Host.CreateDefaultBuilder(args)
                .UseServiceProviderFactory(new AutofacServiceProviderFactory())
                .ConfigureWebHostDefaults(webHostBuilder =>
                {
                    string INWHTTP = Environment.GetEnvironmentVariable("INWHTTP");
                    string INWHTTPS = Environment.GetEnvironmentVariable("INWHTTPS");
                    string INWHTTPS2 = Environment.GetEnvironmentVariable("INWHTTPS2");
                    Console.WriteLine($"Environment {INWHTTP} {INWHTTPS} {INWHTTPS2}");
                    int http = int.Parse(INWHTTP, NumberFormatInfo.InvariantInfo);
                    int https = int.Parse(INWHTTPS, NumberFormatInfo.InvariantInfo);
                    int https2 = int.Parse(INWHTTPS2, NumberFormatInfo.InvariantInfo);

                    webHostBuilder
                    .UseStartup<Startup>()
                    .UseKestrel((hostingContext, options) =>
                    {
                        options.Listen(IPAddress.Loopback, http,
                            listenOptions => listenOptions.Protocols = HttpProtocols.Http1
                            );

                        options.Listen(IPAddress.Loopback, https,
                            listenOptions =>
                            {
                                listenOptions.UseHttps();
                                listenOptions.Protocols = HttpProtocols.Http1AndHttp2;
                            });

                        options.Listen(IPAddress.Loopback, https2, o =>
                        {
                            o.UseHttps();
                            o.Protocols = HttpProtocols.Http2;
                        });
                    })
                    .UseSerilog((hostingContext, loggerConfiguration) => loggerConfiguration
                    .ReadFrom.Configuration(hostingContext.Configuration)
                    .Enrich.FromLogContext()
                    .WriteTo.Console()
                    .WriteTo.File(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, $"log/{DateTime.Now:yyyy-MM-dd-HH-mm}.txt")));
                });
        }
    }
}