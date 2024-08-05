//-----------------------------------------------------------------------
// <copyright file="GeneralSettingsTest.cs" company="lanedirt">
// Copyright (c) lanedirt. All rights reserved.
// Licensed under the MIT license. See LICENSE.md file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

namespace AliasVault.E2ETests.Tests.Client;

/// <summary>
/// End-to-end tests for general settings.
/// </summary>
[TestFixture]
[Category("ClientTests")]
[Parallelizable(ParallelScope.Self)]
public class GeneralSettingsTest : ClientPlaywrightTest
{
    /// <summary>
    /// Test if mutating the default email domain works.
    /// </summary>
    /// <returns>Async task.</returns>
    [Test]
    public async Task MutateDefaultEmailDomainTest()
    {
        await NavigateUsingBlazorRouter("settings/general");
        await WaitForUrlAsync("settings/general", "General settings");

        // Check if the expected content is present.
        var pageContent = await Page.TextContentAsync("body");
        Assert.That(pageContent, Does.Contain("Default Email Domain"), "No general settings option visible.");

        // Set the default email domain to "example2.tld".
        var defaultEmailDomainField = Page.Locator("select[id='defaultEmailDomain']");
        await defaultEmailDomainField.SelectOptionAsync("example2.tld");

        // Go to new credential create page and assert that the default email domain is visible on the page.
        await NavigateUsingBlazorRouter("add-credentials");
        await WaitForUrlAsync("add-credentials", "Add credentials");

        var defaultEmailDomainText = await Page.TextContentAsync("body");
        Assert.That(defaultEmailDomainText, Does.Contain("example2.tld"), "Default email domain not visible on add credentials page.");
    }
}
