//-----------------------------------------------------------------------
// <copyright file="UnlockModel.cs" company="lanedirt">
// Copyright (c) lanedirt. All rights reserved.
// Licensed under the MIT license. See LICENSE.md file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

namespace AliasVault.Shared.Models;

using System.ComponentModel.DataAnnotations;

/// <summary>
/// Unlock model.
/// </summary>
public class UnlockModel
{
    /// <summary>
    /// Gets or sets the password.
    /// </summary>
    [Required]
    public string Password { get; set; } = null!;
}
