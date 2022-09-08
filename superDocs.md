## Get Achievements % GET /applications/{application.id#DOCS_GAME_SDK_SDK_STARTER_GUIDE/get-set-up}/achievements

Returns all achievements for the given application. This endpoint has a rate limit of 5 requests per 5 seconds per application.

###### Return Object

```json
[
  {
    "application_id": "461618159171141643",
    "name": {
      "default": "Win the Game"
    },
    "description": {
      "default": "You won!"
    },
    "secret": false,
    "icon_hash": "52c1636444f64ad7cb5368b158847def",
    "id": "580159119969878046",
    "secure": false
  }
]
```


## Get Achievement % GET /applications/{application.id#DOCS_GAME_SDK_SDK_STARTER_GUIDE/get-set-up}/achievements/{achievement.id#DOCS_GAME_SDK_ACHIEVEMENTS/data-models-achievement-struct}

Returns the given achievement for the given application. This endpoint has a rate limit of 5 requests per 5 seconds per application.

###### Return Object

```json
{
  "application_id": "461618159171141643",
  "name": {
    "default": "Win the Game"
  },
  "description": {
    "default": "You won!"
  },
  "secret": false,
  "icon_hash": "52c1636444f64ad7cb5368b158847def",
  "id": "580159119969878046",
  "secure": false
}
```


## Create Achievement % POST /applications/{application.id#DOCS_GAME_SDK_SDK_STARTER_GUIDE/get-set-up}/achievements

Creates a new achievement for your application. Applications can have a maximum of 1000 achievements. This endpoint has a rate limit of 5 requests per 5 seconds per application.

###### Parameters

| name        | type      | description                             |
| ----------- | --------- | --------------------------------------- |
| name        | string    | the name of the achievement             |
| description | string    | the user-facing achievement description |
| secret      | bool      | if the achievement is secret            |
| secure      | bool      | if the achievement is secure            |
| icon        | ImageType | the icon for the achievement            |

###### Example: Creating an Achievement

```json
{
  "name": {
    "default": "Find the Secret"
  },
  "description": {
    "default": "You found it!"
  },
  "secret": true,
  "secure": false,
  "icon": "data:image/png;base64,base64_data_here"
}
```

###### Return Object

```json
{
  "application_id": "461618159171141643",
  "name": {
    "default": "Find the Secret"
  },
  "description": {
    "default": "You found it!"
  },
  "secret": true,
  "icon_hash": "52c1636444f64ad7cb5368b158847def",
  "id": "597763781871861018",
  "secure": false
}
```


## Update Achievement % PATCH /applications/{application.id#DOCS_GAME_SDK_SDK_STARTER_GUIDE/get-set-up}/achievements/{achievement.id#DOCS_GAME_SDK_ACHIEVEMENTS/data-models-achievement-struct}

Updates the achievement for **\_\_ALL USERS\_\_**. This is **NOT** to update a single user's achievement progress; this is to edit the UserAchievement itself. This endpoint has a rate limit of 5 requests per 5 seconds per application.

###### Parameters

| name        | type      | description                             |
| ----------- | --------- | --------------------------------------- |
| name        | string    | the name of the achievement             |
| description | string    | the user-facing achievement description |
| secret      | bool      | if the achievement is secret            |
| secure      | bool      | if the achievement is secure            |
| icon        | ImageType | the icon for the achievement            |

###### Example: Updating an Achievement

```json
{
  "name": {
    "default": "How do methods break up?"
  },
  "description": {
    "default": "They stop calling each other!"
  },
  "secret": false,
  "secure": false,
  "icon": "data:image/png;base64,base64_data_here"
}
```

###### Return Object

```json
{
  "application_id": "461618159171141643",
  "name": {
    "default": "How do methods break up?"
  },
  "description": {
    "default": "They stop calling each other!"
  },
  "secret": false,
  "icon_hash": "7d698b594c691e3d28c92e226b28293c",
  "id": "597638720379682816",
  "secure": false
}
```


## Delete Achievement % DELETE /applications/{application.id#DOCS_GAME_SDK_SDK_STARTER_GUIDE/get-set-up}/achievements/{achievement.id#DOCS_GAME_SDK_ACHIEVEMENTS/data-models-achievement-struct}

Deletes the given achievement from your application. This endpoint has a rate limit of 5 requests per 5 seconds per application.

###### Return Object

```json
// 204 No Content
```


## Update User Achievement % PUT /users/{user.id#DOCS_RESOURCES_USER/user-object}/applications/{application.id#DOCS_GAME_SDK_SDK_STARTER_GUIDE/get-set-up}/achievements/{achievement.id#DOCS_GAME_SDK_ACHIEVEMENTS/data-models-achievement-struct}

Updates the UserAchievement record for a given user. Use this endpoint to update `secure` achievement progress for users. This endpoint has a rate limit of 5 requests per 5 seconds per application.

###### Parameters

| name             | type | description                                            |
| ---------------- | ---- | ------------------------------------------------------ |
| percent_complete | int  | the user's progress towards completing the achievement |

###### Return Object

```json
{}
```


## Get User Achievements % GET /users/@me/applications/{application.id#DOCS_GAME_SDK_SDK_STARTER_GUIDE/get-set-up}/achievements

Returns a list of achievements for the user whose token you're making the request with. This endpoint will **NOT** accept the Bearer token for your application generated via the [Client Credentials Grant](#DOCS_TOPICS_OAUTH2/client-credentials-grant). You will need the _user's_ bearer token, gotten via either the [Authorization Code OAuth2 Grant](#DOCS_TOPICS_OAUTH2/authorization-code-grant) or via the SDK with [GetOAuth2Token](#DOCS_GAME_SDK_APPLICATIONS/getoauth2token). This endpoint has a rate limit of 2 requests per 5 seconds per application per user.

> info
> This endpoint will _not_ return any achievements marked as `secret` that the user has not yet completed.

###### Return Object

```json
[
  {
    "application_id": "461618159171141643",
    "name": {
      "default": "Win the Game"
    },
    "description": {
      "default": "You won!"
    },
    "secret": false,
    "icon_hash": "52c1636444f64ad7cb5368b158847def",
    "id": "580159119969878046",
    "secure": false
  }
]
```


## Create Lobby % POST /lobbies

Creates a new lobby. Returns an object similar to the SDK `Lobby` struct, documented below.

To get a list of valid regions, call the [List Voice Regions](https://discord.com/developers/docs/resources/voice#list-voice-regions) endpoint.

###### Parameters

| name           | type      | description                                                                                          |
| -------------- | --------- | ---------------------------------------------------------------------------------------------------- |
| application_id | string    | your application id                                                                                  |
| type           | LobbyType | the type of lobby                                                                                    |
| metadata       | dict      | metadata for the lobby - key/value pairs with types `string`                                         |
| capacity       | int       | max lobby capacity with a default of 16                                                              |
| region         | string    | the region in which to make the lobby - defaults to the region of the requesting server's IP address |

###### Return Object

```json
{
  "capacity": 10,
  "region": "us-west",
  "secret": "400316b221351324",
  "application_id": "299996444748734465",
  "metadata": {
    "a": "wow",
    "b": "some test metadata"
  },
  "type": 1,
  "id": "469317204969993265",
  "owner_id": "53908232599983680"
}
```


## Update Lobby % PATCH /lobbies/{lobby.id#DOCS_LOBBIES/data-models-lobby-struct}

Updates a lobby.

###### Parameters

| name     | type      | description                                                  |
| -------- | --------- | ------------------------------------------------------------ |
| type     | LobbyType | the type of lobby                                            |
| metadata | dict      | metadata for the lobby - key/value pairs with types `string` |
| capacity | int       | max lobby capacity with a default of 16                      |


## Delete Lobby % DELETE /lobbies/{lobby.id#DOCS_GAME_SDK_LOBBIES/data-models-lobby-struct}

Deletes a lobby.


## Update Lobby Member % PATCH /lobbies/{lobby.id#DOCS_GAME_SDK_LOBBIES/data-models-lobby-struct}/members/{user.id#DOCS_RESOURCES_USER/user-object}

Updates the metadata for a lobby member.

###### Parameters

| name     | type | description                                                         |
| -------- | ---- | ------------------------------------------------------------------- |
| metadata | dict | metadata for the lobby member - key/value pairs with types `string` |


## Create Lobby Search % POST /lobbies/search

Creates a lobby search for matchmaking around given criteria.

###### Parameters

| name           | type                          | description                              |
| -------------- | ----------------------------- | ---------------------------------------- |
| application_id | string                        | your application id                      |
| filter         | array of SearchFilter objects | the filter to check against              |
| sort           | array of SearchSort objects   | how to sort the results                  |
| limit          | int                           | limit of lobbies returned, default of 25 |

###### SearchFilter Object

| name       | type             | description                                       |
| ---------- | ---------------- | ------------------------------------------------- |
| key        | string           | the metadata key to search                        |
| value      | string           | the value of the metadata key to validate against |
| cast       | SearchCast       | the type to cast `value` as                       |
| comparison | SearchComparison | how to compare the metadata values                |

###### SearchComparison Types

| name                     | value |
| ------------------------ | ----- |
| EQUAL_TO_OR_LESS_THAN    | -2    |
| LESS_THAN                | -1    |
| EQUAL                    | 0     |
| EQUAL_TO_OR_GREATER_THAN | 1     |
| GREATER_THAN             | 2     |
| NOT_EQUAL                | 3     |

###### SearchSort Object

| name       | type       | description                                                             |
| ---------- | ---------- | ----------------------------------------------------------------------- |
| key        | string     | the metadata key on which to sort lobbies that meet the search criteria |
| cast       | SearchCast | the type to cast `value` as                                             |
| near_value | string     | the value around which to sort the key                                  |

###### SearchCast Types

| name   | value |
| ------ | ----- |
| STRING | 1     |
| NUMBER | 2     |


## Send Lobby Data % POST /lobbies/{lobby.id#DOCS_GAME_SDK_LOBBIES/data-models-lobby-struct}/send

Sends a message to the lobby, fanning it out to other lobby members.

This endpoints accepts a UTF8 string. If your message is already a string, you're good to go! If you want to send binary, you can send it to this endpoint as a base64 encoded data uri.

###### Parameters

| name | type   | description                                 |
| ---- | ------ | ------------------------------------------- |
| data | string | a message to be sent to other lobby members |


## Get Entitlements % GET /applications/{application.id#DOCS_GAME_SDK_SDK_STARTER_GUIDE/get-set-up}/entitlements

Gets entitlements for a given user. You can use this on your game backend to check entitlements of an arbitrary user, or perhaps in an administrative panel for your support team.

###### Query Parameters

| name           | type                              | description                                                                                                                    |
| -------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| user_id?       | snowflake                         | the user id to look up entitlements for                                                                                        |
| sku_ids?       | comma-delimited set of snowflakes | (optional) the list SKU ids to check entitlements for                                                                          |
| with_payments? | bool                              | returns [limited payment data](#DOCS_GAME_SDK_STORE/httpspecific-data-models-limited-payment-data-object) for each entitlement |
| before?        | snowflake                         | retrieve entitlements before this time                                                                                         |
| after?         | snowflake                         | retrieve entitlements after this time                                                                                          |
| limit?         | int                               | number of entitlements to return, 1-100, default 100                                                                           |

###### Example

```
curl https://discord.com/api/v6/applications/461618159171141643/entitlements?user_id=53908232506183680&sku_ids=53908232599983680&with_payments=true&limit=1 \
-H "Authorization: Bearer <token>" \
-H "Accept: application/json"

// Returns

{
  [
    {
      "user_id": "53908232506183680",
      "sku_id": "53908232599983680",
      "application_id": "461618159171141643",
      "id": "53908232506183999",
      "type": 1,
      "payment": {
        "id": "538491076055400999",
        "currency": "usd",
        "amount": 999,
        "tax": 0,
        "tax_inclusive": false
      }
    }
  ]
}
```


## Get Entitlement % GET /applications/{application.id#DOCS_GAME_SDK_SDK_STARTER_GUIDE/get-set-up}/entitlements/{entitlement.id#DOCS_GAME_SDK_STORE/data-models-entitlement-struct}

Fetch an entitlement by its ID. This may be useful in confirming that a user has a given entitlement that another call or the SDK says they do.

###### Query Parameters

| name          | type | description                                                                                                                    |
| ------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------ |
| with_payment? | bool | returns [limited payment data](#DOCS_GAME_SDK_STORE/httpspecific-data-models-limited-payment-data-object) for each entitlement |

###### Example

```
curl https://discord.com/api/v6/applications/461618159171141643/entitlements/53908232506183999?with_payment=true \
-H "Authorization: Bearer <token>" \
-H "Accept: application/json"

// Returns

{
  "user_id": "53908232506183680",
  "sku_id": "53908232599983680",
  "application_id": "461618159171141643",
  "id": "53908232506183999",
  "type": 3,
  "payment": {
    "id": "538491076055400999",
    "currency": "usd",
    "amount": 999,
    "tax": 0,
    "tax_inclusive": false
  }
}
```


## Get SKUs % GET /applications/{application.id#DOCS_GAME_SDK_SDK_STARTER_GUIDE/get-set-up}/skus

Get all SKUs for an application.

###### Example

```
curl https://discord.com/api/v6/applications/461618159171141643/skus \
-H "Authorization: Bearer <token>" \
-H "Accept: application/json"

// Returns

{
  [
    {
      "id": "53908232599983680",
      "type": 1,
      "dependent_sku_id": null,
      "application_id": "461618159171141643",
      "manifest_labels": ["461618159171111111"],
      "name": "My Awesome Test Game",
      "access_type": 1,
      "features": [1, 2, 3],
      "system_requirements": {},
      "content_ratings": {},
      "release_date": "1999-01-01",
      "legal_notice": {},
      "price_tier": 1099,
      "price": {},
      "premium": false,
      "locales": ["en-US"],
      "bundled_skus": null
    }
  ]
}
```


## Consume SKU % POST /applications/{application.id#DOCS_GAME_SDK_SDK_STARTER_GUIDE/get-set-up}/entitlements/{entitlement.id#DOCS_GAME_SDK_STORE/data-models-entitlement-struct}/consume

Marks a given entitlement for the user as consumed, meaning it will no longer be returned in an entitlements check. **Ensure the user was granted whatever items the entitlement was for before consuming it!**

###### Example

```
curl -X POST https://discord.com/api/v6/applications/461618159171141643/entitlements/53908232506183999/consume \
-H "Authorization: Bearer <token>" \
-H "Accept: application/json"

// Returns 204 No Content
```


## Delete Test Entitlement % DELETE /applications/{application.id#DOCS_GAME_SDK_SDK_STARTER_GUIDE/get-set-up}/entitlements/{entitlement.id#DOCS_GAME_SDK_STORE/data-models-entitlement-struct}

Deletes a test entitlement for an application. You can only delete entitlements that were "purchased" in developer test mode; these are entitlements of `type == TestModePurchase`. You cannot use this route to delete arbitrary entitlements that users actually purchased.

###### Example

```
curl -X DELETE https://discord.com/api/v6/applications/461618159171141643/entitlements/53908232506183999 \
-H "Authorization: Bearer <token>" \
-H "Accept: application/json"

// Returns 204 No Content
```


## Create Purchase Discount % PUT /store/skus/{sku.id#DOCS_GAME_SDK_STORE/data-models-sku-struct}/discounts/{user.id#DOCS_RESOURCES_USER/user-object}

Creates a discount for the given user on their next purchase of the given SKU. You should call this endpoint from your backend server just before calling [StartPurchase](#DOCS_GAME_SDK_STORE/startpurchase) for the SKU you wish to discount. The user will then see a discounted price for that SKU at time of payment. The discount is automatically consumed after successful purchase or if the TTL expires.

###### Parameters

| name        | type | description                                                                            |
| ----------- | ---- | -------------------------------------------------------------------------------------- |
| percent_off | int  | the percentage to discount - max of 100, min of 1                                      |
| ttl?        | int  | the time to live for the discount, in seconds - max of 3600, min of 60, default of 600 |

###### Example

```
curl -X PUT https://discord.com/api/v6/store/skus/461618229171141643/discounts/53908232522183999 \
-H "Authorization: Bearer <token>" \
-H "Accept: application/json" \
-H "Content-type: application/json" \
-d '{"percent_off": 10, "ttl": 600}'

// Returns 204 No Content
```


## Delete Purchase Discount % DELETE /store/skus/{sku.id#DOCS_GAME_SDK_STORE/data-models-sku-struct}/discounts/{user.id#DOCS_RESOURCES_USER/user-object}

Deletes the currently active discount on the given SKU for the given user. You **do not need** to call this after a user has made a discounted purchase; successful discounted purchases will automatically remove the discount for that user for subsequent purchases.

###### Example

```
curl -X DELETE https://discord.com/api/v6/store/skus/461618229171141643/discounts/53908232522183999 \
-H "Authorization: Bearer <token>" \
-H "Accept: application/json"

// Returns 204 No Content
```


## Get Global Application Commands % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/commands

> warn
> The objects returned by this endpoint may be augmented with [additional fields if localization is active](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/retrieving-localized-commands).

Fetch all of the global commands for your application. Returns an array of [application command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object) objects.

###### Query String Params

| Field               | Type    | Description                                                                                                                                                                                                            |
| ------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| with_localizations? | boolean | Whether to include full localization dictionaries (`name_localizations` and `description_localizations`) in the returned objects, instead of the `name_localized` and `description_localized` fields. Default `false`. |


## Create Global Application Command % POST /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/commands

> danger
> Creating a command with the same name as an existing command for your application will overwrite the old command.

Create a new global command. Returns `201` and an [application command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object) object.

###### JSON Params

| Field                       | Type                                                                                                                                           | Description                                                                                                                                                          |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name                        | string                                                                                                                                         | [Name of command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-naming), 1-32 characters                                    |
| name_localizations?         | ?dictionary with keys in [available locales](#DOCS_REFERENCE/locales)                                                                          | Localization dictionary for the `name` field. Values follow the same restrictions as `name`                                                                          |
| description                 | string                                                                                                                                         | 1-100 character description                                                                                                                                          |
| description_localizations?  | ?dictionary with keys in [available locales](#DOCS_REFERENCE/locales)                                                                          | Localization dictionary for the `description` field. Values follow the same restrictions as `description`                                                            |
| options?                    | array of [application command option](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-option-structure) | the parameters for the command                                                                                                                                       |
| default_member_permissions? | ?string                                                                                                                                        | Set of [permissions](#DOCS_TOPICS_PERMISSIONS) represented as a bit set                                                                                              |
| dm_permission?              | ?boolean                                                                                                                                       | Indicates whether the command is available in DMs with the app, only for globally-scoped commands. By default, commands are visible.                                 |
| default_permission?         | boolean (default `true`)                                                                                                                       | Replaced by `default_member_permissions` and will be deprecated in the future. Indicates whether the command is enabled by default when the app is added to a guild. |  |
| type?                       | one of [application command type](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-types)                | Type of command, defaults `1` if not set                                                                                                                             |


## Get Global Application Command % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/commands/{command.id#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object}

Fetch a global command for your application. Returns an [application command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object) object.


## Edit Global Application Command % PATCH /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/commands/{command.id#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object}

> info
> All parameters for this endpoint are optional.

Edit a global command. Returns `200` and an [application command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object) object. All fields are optional, but any fields provided will entirely overwrite the existing values of those fields.

###### JSON Params

| Field                       | Type                                                                                                                                           | Description                                                                                                                                                          |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name?                       | string                                                                                                                                         | [Name of command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-naming), 1-32 characters                                    |
| name_localizations?         | ?dictionary with keys in [available locales](#DOCS_REFERENCE/locales)                                                                          | Localization dictionary for the `name` field. Values follow the same restrictions as `name`                                                                          |
| description?                | string                                                                                                                                         | 1-100 character description                                                                                                                                          |
| description_localizations?  | ?dictionary with keys in [available locales](#DOCS_REFERENCE/locales)                                                                          | Localization dictionary for the `description` field. Values follow the same restrictions as `description`                                                            |
| options?                    | array of [application command option](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-option-structure) | the parameters for the command                                                                                                                                       |
| default_member_permissions? | ?string                                                                                                                                        | Set of [permissions](#DOCS_TOPICS_PERMISSIONS) represented as a bit set                                                                                              |
| dm_permission?              | ?boolean                                                                                                                                       | Indicates whether the command is available in DMs with the app, only for globally-scoped commands. By default, commands are visible.                                 |
| default_permission?         | boolean (default `true`)                                                                                                                       | Replaced by `default_member_permissions` and will be deprecated in the future. Indicates whether the command is enabled by default when the app is added to a guild. |  |


## Delete Global Application Command % DELETE /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/commands/{command.id#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object}

Deletes a global command. Returns `204 No Content` on success.


## Bulk Overwrite Global Application Commands % PUT /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/commands

Takes a list of application commands, overwriting the existing global command list for this application. Returns `200` and a list of [application command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object) objects. Commands that do not already exist will count toward daily application command create limits.

> danger
> This will overwrite **all** types of application commands: slash commands, user commands, and message commands.


## Get Guild Application Commands % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands

> warn
> The objects returned by this endpoint may be augmented with [additional fields if localization is active](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/retrieving-localized-commands).

Fetch all of the guild commands for your application for a specific guild. Returns an array of [application command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object) objects.

###### Query String Params

| Field               | Type    | Description                                                                                                                                                                                                            |
| ------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| with_localizations? | boolean | Whether to include full localization dictionaries (`name_localizations` and `description_localizations`) in the returned objects, instead of the `name_localized` and `description_localized` fields. Default `false`. |


## Create Guild Application Command % POST /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands

> danger
> Creating a command with the same name as an existing command for your application will overwrite the old command.

Create a new guild command. New guild commands will be available in the guild immediately. Returns `201` and an [application command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object) object. If the command did not already exist, it will count toward daily application command create limits.

###### JSON Params

| Field                       | Type                                                                                                                                           | Description                                                                                                                                                          |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name                        | string                                                                                                                                         | [Name of command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-naming), 1-32 characters                                    |
| name_localizations?         | ?dictionary with keys in [available locales](#DOCS_REFERENCE/locales)                                                                          | Localization dictionary for the `name` field. Values follow the same restrictions as `name`                                                                          |
| description                 | string                                                                                                                                         | 1-100 character description                                                                                                                                          |
| description_localizations?  | ?dictionary with keys in [available locales](#DOCS_REFERENCE/locales)                                                                          | Localization dictionary for the `description` field. Values follow the same restrictions as `description`                                                            |
| options?                    | array of [application command option](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-option-structure) | Parameters for the command                                                                                                                                           |
| default_member_permissions? | ?string                                                                                                                                        | Set of [permissions](#DOCS_TOPICS_PERMISSIONS) represented as a bit set                                                                                              |
| default_permission?         | boolean (default `true`)                                                                                                                       | Replaced by `default_member_permissions` and will be deprecated in the future. Indicates whether the command is enabled by default when the app is added to a guild. |  |
| type?                       | one of [application command type](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-types)                | Type of command, defaults `1` if not set                                                                                                                             |


## Get Guild Application Command % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/{command.id#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object}

Fetch a guild command for your application. Returns an [application command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object) object.


## Edit Guild Application Command % PATCH /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/{command.id#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object}

> info
> All parameters for this endpoint are optional.

Edit a guild command. Updates for guild commands will be available immediately. Returns `200` and an [application command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object) object. All fields are optional, but any fields provided will entirely overwrite the existing values of those fields.

###### JSON Params

| Field                       | Type                                                                                                                                           | Description                                                                                                                                                          |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name?                       | string                                                                                                                                         | [Name of command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-naming), 1-32 characters                                    |
| name_localizations?         | ?dictionary with keys in [available locales](#DOCS_REFERENCE/locales)                                                                          | Localization dictionary for the `name` field. Values follow the same restrictions as `name`                                                                          |
| description?                | string                                                                                                                                         | 1-100 character description                                                                                                                                          |
| description_localizations?  | ?dictionary with keys in [available locales](#DOCS_REFERENCE/locales)                                                                          | Localization dictionary for the `description` field. Values follow the same restrictions as `description`                                                            |
| options?                    | array of [application command option](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-option-structure) | Parameters for the command                                                                                                                                           |
| default_member_permissions? | ?string                                                                                                                                        | Set of [permissions](#DOCS_TOPICS_PERMISSIONS) represented as a bit set                                                                                              |
| default_permission?         | boolean (default `true`)                                                                                                                       | Replaced by `default_member_permissions` and will be deprecated in the future. Indicates whether the command is enabled by default when the app is added to a guild. |


## Delete Guild Application Command % DELETE /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/{command.id#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object}

Delete a guild command. Returns `204 No Content` on success.


## Bulk Overwrite Guild Application Commands % PUT /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands

Takes a list of application commands, overwriting the existing command list for this application for the targeted guild. Returns `200` and a list of [application command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object) objects.

> danger
> This will overwrite **all** types of application commands: slash commands, user commands, and message commands.

###### Bulk Application Command JSON Params

| Field                       | Type                                                                                                                                           | Description                                                                                                                                                          |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id?                         | snowflake                                                                                                                                      | ID of the command, if known                                                                                                                                          |
| name                        | string                                                                                                                                         | [Name of command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-naming), 1-32 characters                                    |
| name_localizations?         | ?dictionary with keys in [available locales](#DOCS_REFERENCE/locales)                                                                          | Localization dictionary for the `name` field. Values follow the same restrictions as `name`                                                                          |
| description                 | string                                                                                                                                         | 1-100 character description                                                                                                                                          |
| description_localizations?  | ?dictionary with keys in [available locales](#DOCS_REFERENCE/locales)                                                                          | Localization dictionary for the `description` field. Values follow the same restrictions as `description`                                                            |
| options?                    | array of [application command option](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-option-structure) | Parameters for the command                                                                                                                                           |
| default_member_permissions? | ?string                                                                                                                                        | Set of [permissions](#DOCS_TOPICS_PERMISSIONS) represented as a bit set                                                                                              |
| dm_permission?              | ?boolean                                                                                                                                       | Indicates whether the command is available in DMs with the app, only for globally-scoped commands. By default, commands are visible.                                 |
| default_permission?         | boolean (default `true`)                                                                                                                       | Replaced by `default_member_permissions` and will be deprecated in the future. Indicates whether the command is enabled by default when the app is added to a guild. |
| type?                       | one of [application command type](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-types)                | Type of command, defaults `1` if not set                                                                                                                             |


## Get Guild Application Command Permissions % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/permissions

Fetches permissions for all commands for your application in a guild. Returns an array of [guild application command permissions](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-permissions-object-guild-application-command-permissions-structure) objects.


## Get Application Command Permissions % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/{command.id#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object}/permissions

Fetches permissions for a specific command for your application in a guild. Returns a [guild application command permissions](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-permissions-object-guild-application-command-permissions-structure) object.


## Edit Application Command Permissions % PUT /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/{command.id#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object}/permissions

> warn
> This endpoint will overwrite existing permissions for the command in that guild

Edits command permissions for a specific command for your application in a guild and returns a [guild application command permissions](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-permissions-object-guild-application-command-permissions-structure) object.

You can add up to 100 permission overwrites for a command.

> info
> This endpoint requires authentication with a Bearer token that has permission to manage the guild and its roles. For more information, read above about [application command permissions](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/permissions).

> warn
> Deleting or renaming a command will permanently delete all permissions for the command

###### JSON Params

| Field       | Type                                                                                                                                                                 | Description                              |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| permissions | array of [application command permissions](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-permissions-object-application-command-permissions-structure) | Permissions for the command in the guild |


## Batch Edit Application Command Permissions % PUT /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/permissions

> danger
> This endpoint has been disabled with [updates to command permissions (Permissions v2)](#DOCS_CHANGE_LOG/updated-command-permissions). Instead, you can [edit each application command permissions](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/edit-application-command-permissions) (though you should be careful to handle any potential [rate limits](#DOCS_TOPICS_RATE_LIMITS)).


## Create Interaction Response % POST /interactions/{interaction.id#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction}/{interaction.token#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object}/callback

Create a response to an Interaction from the gateway. Body is an [interaction response](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-response-object). Returns `204 No Content`.

This endpoint also supports file attachments similar to the webhook endpoints. Refer to [Uploading Files](#DOCS_REFERENCE/uploading-files) for details on uploading files and `multipart/form-data` requests.


## Get Original Interaction Response % GET /webhooks/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/{interaction.token#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object}/messages/@original

Returns the initial Interaction response. Functions the same as [Get Webhook Message](#DOCS_RESOURCES_WEBHOOK/get-webhook-message).


## Edit Original Interaction Response % PATCH /webhooks/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/{interaction.token#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object}/messages/@original

Edits the initial Interaction response. Functions the same as [Edit Webhook Message](#DOCS_RESOURCES_WEBHOOK/edit-webhook-message).


## Delete Original Interaction Response % DELETE /webhooks/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/{interaction.token#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object}/messages/@original

Deletes the initial Interaction response. Returns `204 No Content` on success. Does not support ephemeral followups.


## Create Followup Message % POST /webhooks/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/{interaction.token#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object}

Create a followup message for an Interaction. Functions the same as [Execute Webhook](#DOCS_RESOURCES_WEBHOOK/execute-webhook), but `wait` is always true. The `thread_id`, `avatar_url`, and `username` parameters are not supported when using this endpoint for interaction followups.

`flags` can be set to `64` to mark the message as ephemeral, except when it is the first followup message to a deferred Interactions Response. In that case, the `flags` field will be ignored, and the ephemerality of the message will be determined by the `flags` value in your original ACK.


## Get Followup Message % GET /webhooks/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/{interaction.token#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Returns a followup message for an Interaction. Functions the same as [Get Webhook Message](#DOCS_RESOURCES_WEBHOOK/get-webhook-message).


## Edit Followup Message % PATCH /webhooks/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/{interaction.token#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Edits a followup message for an Interaction. Functions the same as [Edit Webhook Message](#DOCS_RESOURCES_WEBHOOK/edit-webhook-message).


## Delete Followup Message % DELETE /webhooks/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/{interaction.token#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Deletes a followup message for an Interaction. Returns `204 No Content` on success. Does not support ephemeral followups.


## Get Guild Audit Log % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/audit-logs

Returns an [audit log](#DOCS_RESOURCES_AUDIT_LOG/audit-log-object) object for the guild. Requires the [`VIEW_AUDIT_LOG`](#DOCS_TOPICS_PERMISSIONS/permissions-bitwise-permission-flags) permission.

###### Query String Params

The following parameters can be used to filter which and how many audit log entries are returned.

| Field        | Type      | Description                                                                                                 |
| ------------ | --------- | ----------------------------------------------------------------------------------------------------------- |
| user_id?     | snowflake | Entries from a specific user ID                                                                             |
| action_type? | integer   | Entries for a specific [audit log event](#DOCS_RESOURCES_AUDIT_LOG/audit-log-entry-object-audit-log-events) |
| before?      | snowflake | Entries that preceded a specific audit log entry ID                                                         |
| limit?       | integer   | Maximum number of entries (between 1-100) to return, defaults to 50                                         |


## List Auto Moderation Rules for Guild % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/auto-moderation/rules

Get a list of all rules currently configured for the guild. Returns a list of [auto moderation rule](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object) objects for the given guild.

> info
> This endpoint requires the `MANAGE_GUILD` [permission](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-permission-requirements).


## Get Auto Moderation Rule % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/auto-moderation/rules/{auto_moderation_rule.id#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object}

Get a single rule. Returns an [auto moderation rule](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object) object.

> info
> This endpoint requires the `MANAGE_GUILD` [permission](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-permission-requirements).


## Create Auto Moderation Rule % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/auto-moderation/rules

Create a new rule. Returns an [auto moderation rule](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object) on success.

> info
> This endpoint requires the `MANAGE_GUILD` [permission](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-permission-requirements).

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field               | Type                                                                                     | Description                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| name                | string                                                                                   | the rule name                                                                                        |
| event_type          | integer                                                                                  | the [event type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-event-types)            |
| trigger_type        | integer                                                                                  | the [trigger type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types)        |
| trigger_metadata? * | object                                                                                   | the [trigger metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-metadata) |
| actions             | array of [action](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object) objects | the actions which will execute when the rule is triggered                                            |
| enabled?            | boolean                                                                                  | whether the rule is enabled (False by default)                                                       |
| exempt_roles?       | array of snowflakes                                                                      | the role ids that should not be affected by the rule (Maximum of 20)                                 |
| exempt_channels?    | array of snowflakes                                                                      | the channel ids that should not be affected by the rule (Maximum of 50)                              |

\* Can be omitted based on `trigger_type`. See the `Associated Trigger Types` column in [trigger metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-metadata) to understand which `trigger_type` values require `trigger_metadata` to be set.

> info
> See [Trigger Types](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types) for limits on how many rules of each trigger type can be created per guild.



## Modify Auto Moderation Rule % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/auto-moderation/rules/{auto_moderation_rule.id#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object}

Modify an existing rule. Returns an [auto moderation rule](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object) on success.

> info
> Requires `MANAGE_GUILD` [permissions](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-permission-requirements).

> info
> All parameters for this endpoint are optional.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field               | Type                                                                                     | Description                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| name                | string                                                                                   | the rule name                                                                                        |
| event_type          | integer                                                                                  | the [event type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-event-types)            |
| trigger_metadata? * | object                                                                                   | the [trigger metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-metadata) |
| actions             | array of [action](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object) objects | the actions which will execute when the rule is triggered                                            |
| enabled             | boolean                                                                                  | whether the rule is enabled                                                                          |
| exempt_roles        | array of snowflakes                                                                      | the role ids that should not be affected by the rule (Maximum of 20)                                 |
| exempt_channels     | array of snowflakes                                                                      | the channel ids that should not be affected by the rule (Maximum of 50)                              |

\* Can be omitted based on `trigger_type`. See the `Associated Trigger Types` column in [trigger metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-metadata) to understand which `trigger_type` values require `trigger_metadata` to be set.


## Delete Auto Moderation Rule % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/auto-moderation/rules/{auto_moderation_rule.id#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object}

Delete a rule. Returns a `204` on success.

> info
> This endpoint requires the `MANAGE_GUILD` [permission](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-permission-requirements).

> info
> This endpoint supports the `X-Audit-Log-Reason` header.


## Get Channel % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}

Get a channel by ID. Returns a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object.  If the channel is a thread, a [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) object is included in the returned result.


## Modify Channel % PATCH /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}

Update a channel's settings. Returns a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) on success, and a 400 BAD REQUEST on invalid parameters. All JSON parameters are optional.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params (Group DM)

Fires a [Channel Update](#DOCS_TOPICS_GATEWAY/channel-update) Gateway event.

| Field | Type   | Description                  |
| ----- | ------ | ---------------------------- |
| name  | string | 1-100 character channel name |
| icon  | binary | base64 encoded icon          |

###### JSON Params (Guild channel)

Requires the `MANAGE_CHANNELS` permission for the guild. Fires a [Channel Update](#DOCS_TOPICS_GATEWAY/channel-update) Gateway event. If modifying a category, individual [Channel Update](#DOCS_TOPICS_GATEWAY/channel-update) events will fire for each child channel that also changes. If modifying permission overwrites, the `MANAGE_ROLES` permission is required. Only permissions your bot has in the guild or parent channel (if applicable) can be allowed/denied (unless your bot has a `MANAGE_ROLES` overwrite in the channel).

| Field                               | Type                                                                            | Description                                                                                                                                                                        | Channel Type                     |
| ----------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| name                                | string                                                                          | 1-100 character channel name                                                                                                                                                       | All                              |
| type                                | integer                                                                         | the [type of channel](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types); only conversion between text and announcement is supported and only in guilds with the "NEWS" feature | Text, Announcement               |
| position                            | ?integer                                                                        | the position of the channel in the left-hand listing                                                                                                                               | All                              |
| topic                               | ?string                                                                         | 0-1024 character channel topic (0-4096 characters for `GUILD_FORUM` channels)                                                                                                      | Text, Announcement, Forum        |
| nsfw                                | ?boolean                                                                        | whether the channel is nsfw                                                                                                                                                        | Text, Voice, Announcement, Forum |
| rate_limit_per_user                 | ?integer                                                                        | amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission `manage_messages` or `manage_channel`, are unaffected    | Text, Forum                      |
| bitrate\*                           | ?integer                                                                        | the bitrate (in bits) of the voice or stage channel; min 8000                                                                                                                      | Voice, Stage                     |
| user_limit                          | ?integer                                                                        | the user limit of the voice channel; 0 refers to no limit, 1 to 99 refers to a user limit                                                                                          | Voice                            |
| permission_overwrites\*\*           | ?array of partial [overwrite](#DOCS_RESOURCES_CHANNEL/overwrite-object) objects | channel or category-specific permissions                                                                                                                                           | All                              |
| parent_id                           | ?snowflake                                                                      | id of the new parent category for a channel                                                                                                                                        | Text, Voice, Announcement, Forum |
| rtc_region                          | ?string                                                                         | channel [voice region](#DOCS_RESOURCES_VOICE/voice-region-object) id, automatic when set to null                                                                                   | Voice, Stage                     |
| video_quality_mode                  | ?integer                                                                        | the camera [video quality mode](#DOCS_RESOURCES_CHANNEL/channel-object-video-quality-modes) of the voice channel                                                                   | Voice                            |
| default_auto_archive_duration       | ?integer                                                                        | the default duration that the clients use (not the API) for newly created threads in the channel, in minutes, to automatically archive the thread after recent activity            | Text, Announcement, Forum        |
| available_tags?                     | array of [tag](#DOCS_RESOURCES_CHANNEL/forum-tag-object) objects                | the set of tags that can be used in a `GUILD_FORUM` channel                                                                                                                        | Forum                            |
| default_reaction_emoji?             | ?[default reaction](#DOCS_RESOURCES_CHANNEL/default-reaction-object) object     | the emoji to show in the add reaction button on a thread in a `GUILD_FORUM` channel                                                                                                | Forum                            |
| default_thread_rate_limit_per_user? | integer                                                                         | the initial `rate_limit_per_user` to set on newly created threads in a channel. this field is copied to the thread at creation time and does not live update.                      | Text, Forum                      |

\* For voice channels, normal servers can set bitrate up to 96000, servers with Boost level 1 can set up to 128000, servers with Boost level 2 can set up to 256000, and servers with Boost level 3 or the `VIP_REGIONS` [guild feature](#DOCS_RESOURCES_GUILD/guild-object-guild-features) can set up to 384000. For stage channels, bitrate can be set up to 64000.

\*\* In each overwrite object, the `allow` and `deny` keys can be omitted or set to `null`, which both default to `"0"`.

###### JSON Params (Thread)

When setting `archived` to `false`, when `locked` is also `false`, only the `SEND_MESSAGES` permission is required.

Otherwise, requires the `MANAGE_THREADS` permission. Fires a [Thread Update](#DOCS_TOPICS_GATEWAY/thread-update) Gateway event. Requires the thread to have `archived` set to `false` or be set to `false` in the request.

| Field                 | Type                | Description                                                                                                                                                                                       |
| --------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name                  | string              | 1-100 character channel name                                                                                                                                                                      |
| archived              | boolean             | whether the thread is archived                                                                                                                                                                    |
| auto_archive_duration | integer             | the thread will stop showing in the channel list after `auto_archive_duration` minutes of inactivity, can be set to: 60, 1440, 4320, 10080                                                        |
| locked                | boolean             | whether the thread is locked; when a thread is locked, only users with MANAGE_THREADS can unarchive it                                                                                            |
| invitable             | boolean             | whether non-moderators can add other non-moderators to a thread; only available on private threads                                                                                                |
| rate_limit_per_user   | ?integer            | amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission `manage_messages`, `manage_thread`, or `manage_channel`, are unaffected |
| flags?                | integer             | [channel flags](#DOCS_RESOURCES_CHANNEL/channel-object-channel-flags) combined as a [bitfield](https://en.wikipedia.org/wiki/Bit_field); `PINNED` can only be set for threads in forum channels   |
| applied_tags?         | array of snowflakes | the IDs of the set of tags that have been applied to a thread in a `GUILD_FORUM` channel                                                                                                          |


## Delete/Close Channel % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}

Delete a channel, or close a private message. Requires the `MANAGE_CHANNELS` permission for the guild, or `MANAGE_THREADS` if the channel is a thread. Deleting a category does not delete its child channels; they will have their `parent_id` removed and a [Channel Update](#DOCS_TOPICS_GATEWAY/channel-update) Gateway event will fire for each of them. Returns a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object on success. Fires a [Channel Delete](#DOCS_TOPICS_GATEWAY/channel-delete) Gateway event (or [Thread Delete](#DOCS_TOPICS_GATEWAY/thread-delete) if the channel was a thread).

> warn
> Deleting a guild channel cannot be undone. Use this with caution, as it is impossible to undo this action when performed on a guild channel. In contrast, when used with a private message, it is possible to undo the action by opening a private message with the recipient again.

> info
> For Community guilds, the Rules or Guidelines channel and the Community Updates channel cannot be deleted.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.


## Get Channel Messages % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages

Returns the messages for a channel. If operating on a guild channel, this endpoint requires the `VIEW_CHANNEL` permission to be present on the current user. If the current user is missing the `READ_MESSAGE_HISTORY` permission in the channel then this will return no messages (since they cannot read the message history). Returns an array of [message](#DOCS_RESOURCES_CHANNEL/message-object) objects on success.

> info
> The `before`, `after`, and `around` parameters are mutually exclusive, only one may be passed at a time.

###### Query String Params

| Field   | Type      | Description                              | Default |
| ------- | --------- | ---------------------------------------- | ------- |
| around? | snowflake | Get messages around this message ID      | absent  |
| before? | snowflake | Get messages before this message ID      | absent  |
| after?  | snowflake | Get messages after this message ID       | absent  |
| limit?  | integer   | Max number of messages to return (1-100) | 50      |


## Get Channel Message % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Returns a specific message in the channel. If operating on a guild channel, this endpoint requires the `READ_MESSAGE_HISTORY` permission to be present on the current user. Returns a [message](#DOCS_RESOURCES_CHANNEL/message-object) object on success.


## Create Message % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages

> warn
> Discord may strip certain characters from message content, like invalid unicode characters or characters which cause unexpected message formatting. If you are passing user-generated strings into message content, consider sanitizing the data to prevent unexpected behavior and utilizing `allowed_mentions` to prevent unexpected mentions.

Post a message to a guild text or DM channel. Returns a [message](#DOCS_RESOURCES_CHANNEL/message-object) object. Fires a [Message Create](#DOCS_TOPICS_GATEWAY/message-create) Gateway event. See [message formatting](#DOCS_REFERENCE/message-formatting) for more information on how to properly format messages.

To create a message as a reply to another message, apps can include a [`message_reference`](#DOCS_RESOURCES_CHANNEL/message-reference-object-message-reference-structure) with a `message_id`. The `channel_id` and `guild_id` in the `message_reference` are optional, but will be validated if provided.

Files must be attached using a `multipart/form-data` body as described in [Uploading Files](#DOCS_REFERENCE/uploading-files).

###### Limitations

- When operating on a guild channel, the current user must have the `SEND_MESSAGES` permission.
- When sending a message with `tts` (text-to-speech) set to `true`, the current user must have the `SEND_TTS_MESSAGES` permission.
- When creating a message as a reply to another message, the current user must have the `READ_MESSAGE_HISTORY` permission.
    - The referenced message must exist and cannot be a system message.
- The maximum request size when sending a message is **8MiB**
- For the embed object, you can set every field except `type` (it will be `rich` regardless of if you try to set it), `provider`, `video`, and any `height`, `width`, or `proxy_url` values for images.

###### JSON/Form Params

> info
> When creating a message, apps must provide a value for **at least one of** `content`, `embeds`, `sticker_ids`, or `files[n]`.

| Field              | Type                                                                                              | Description                                                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| content?\*         | string                                                                                            | Message contents (up to 2000 characters)                                                                                                                                    |
| tts?               | boolean                                                                                           | `true` if this is a TTS message                                                                                                                                             |
| embeds?\*          | array of [embed](#DOCS_RESOURCES_CHANNEL/embed-object) objects                                    | Embedded `rich` content (up to 6000 characters)                                                                                                                             |
| allowed_mentions?  | [allowed mention object](#DOCS_RESOURCES_CHANNEL/allowed-mentions-object)                         | Allowed mentions for the message                                                                                                                                            |
| message_reference? | [message reference](#DOCS_RESOURCES_CHANNEL/message-reference-object-message-reference-structure) | Include to make your message a reply                                                                                                                                        |
| components?        | array of [message component](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/component-object) objects      | Components to include with the message                                                                                                                                      |
| sticker_ids?\*     | array of snowflakes                                                                               | IDs of up to 3 [stickers](#DOCS_RESOURCES_STICKER/sticker-object) in the server to send in the message                                                                      |
| files[n]?\*        | file contents                                                                                     | Contents of the file being sent. See [Uploading Files](#DOCS_REFERENCE/uploading-files)                                                                                     |
| payload_json?      | string                                                                                            | JSON-encoded body of non-file params, only for `multipart/form-data` requests. See [Uploading Files](#DOCS_REFERENCE/uploading-files)                                       |
| attachments?       | array of partial [attachment](#DOCS_RESOURCES_CHANNEL/attachment-object) objects                  | Attachment objects with filename and description. See [Uploading Files](#DOCS_REFERENCE/uploading-files)                                                                    |
| flags?             | integer                                                                                           | [Message flags](#DOCS_RESOURCES_CHANNEL/message-object-message-flags) combined as a [bitfield](https://en.wikipedia.org/wiki/Bit_field) (only `SUPPRESS_EMBEDS` can be set) |

\* At least one of `content`, `embeds`, `sticker_ids`, or `files[n]` is required.

###### Example Request Body (application/json)

```json
{
  "content": "Hello, World!",
  "tts": false,
  "embeds": [{
    "title": "Hello, Embed!",
    "description": "This is an embedded message."
  }]
}
```

Examples for file uploads are available in [Uploading Files](#DOCS_REFERENCE/uploading-files).


## Crosspost Message % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}/crosspost

Crosspost a message in an Announcement Channel to following channels. This endpoint requires the `SEND_MESSAGES` permission, if the current user sent the message, or additionally the `MANAGE_MESSAGES` permission, for all other messages, to be present for the current user.

Returns a [message](#DOCS_RESOURCES_CHANNEL/message-object) object.


## Create Reaction % PUT /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}/reactions/{emoji#DOCS_RESOURCES_EMOJI/emoji-object}/@me

Create a reaction for the message. This endpoint requires the `READ_MESSAGE_HISTORY` permission to be present on the current user. Additionally, if nobody else has reacted to the message using this emoji, this endpoint requires the `ADD_REACTIONS` permission to be present on the current user. Returns a 204 empty response on success.
The `emoji` must be [URL Encoded](https://en.wikipedia.org/wiki/Percent-encoding) or the request will fail with `10014: Unknown Emoji`. To use custom emoji, you must encode it in the format `name:id` with the emoji name and emoji id.


## Delete Own Reaction % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}/reactions/{emoji#DOCS_RESOURCES_EMOJI/emoji-object}/@me

Delete a reaction the current user has made for the message. Returns a 204 empty response on success.
The `emoji` must be [URL Encoded](https://en.wikipedia.org/wiki/Percent-encoding) or the request will fail with `10014: Unknown Emoji`. To use custom emoji, you must encode it in the format `name:id` with the emoji name and emoji id.


## Delete User Reaction % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}/reactions/{emoji#DOCS_RESOURCES_EMOJI/emoji-object}/{user.id#DOCS_RESOURCES_USER/user-object}

Deletes another user's reaction. This endpoint requires the `MANAGE_MESSAGES` permission to be present on the current user. Returns a 204 empty response on success.
The `emoji` must be [URL Encoded](https://en.wikipedia.org/wiki/Percent-encoding) or the request will fail with `10014: Unknown Emoji`. To use custom emoji, you must encode it in the format `name:id` with the emoji name and emoji id.


## Get Reactions % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}/reactions/{emoji#DOCS_RESOURCES_EMOJI/emoji-object}

Get a list of users that reacted with this emoji. Returns an array of [user](#DOCS_RESOURCES_USER/user-object) objects on success.
The `emoji` must be [URL Encoded](https://en.wikipedia.org/wiki/Percent-encoding) or the request will fail with `10014: Unknown Emoji`. To use custom emoji, you must encode it in the format `name:id` with the emoji name and emoji id.

###### Query String Params

| Field  | Type      | Description                           | Default |
| ------ | --------- | ------------------------------------- | ------- |
| after? | snowflake | Get users after this user ID          | absent  |
| limit? | integer   | Max number of users to return (1-100) | 25      |


## Delete All Reactions % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}/reactions

Deletes all reactions on a message. This endpoint requires the `MANAGE_MESSAGES` permission to be present on the current user. Fires a [Message Reaction Remove All](#DOCS_TOPICS_GATEWAY/message-reaction-remove-all) Gateway event.


## Delete All Reactions for Emoji % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}/reactions/{emoji#DOCS_RESOURCES_EMOJI/emoji-object}

Deletes all the reactions for a given emoji on a message. This endpoint requires the `MANAGE_MESSAGES` permission to be present on the current user. Fires a [Message Reaction Remove Emoji](#DOCS_TOPICS_GATEWAY/message-reaction-remove-emoji) Gateway event.
The `emoji` must be [URL Encoded](https://en.wikipedia.org/wiki/Percent-encoding) or the request will fail with `10014: Unknown Emoji`. To use custom emoji, you must encode it in the format `name:id` with the emoji name and emoji id.


## Edit Message % PATCH /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Edit a previously sent message. The fields `content`, `embeds`, and `flags` can be edited by the original message author. Other users can only edit `flags` and only if they have the `MANAGE_MESSAGES` permission in the corresponding channel. When specifying flags, ensure to include all previously set flags/bits in addition to ones that you are modifying. Only `flags` documented in the table below may be modified by users (unsupported flag changes are currently ignored without error).

When the `content` field is edited, the `mentions` array in the message object will be reconstructed from scratch based on the new content. The `allowed_mentions` field of the edit request controls how this happens. If there is no explicit `allowed_mentions` in the edit request, the content will be parsed with _default_ allowances, that is, without regard to whether or not an `allowed_mentions` was present in the request that originally created the message.

Returns a [message](#DOCS_RESOURCES_CHANNEL/message-object) object. Fires a [Message Update](#DOCS_TOPICS_GATEWAY/message-update) Gateway event.

Refer to [Uploading Files](#DOCS_REFERENCE/uploading-files) for details on attachments and `multipart/form-data` requests.
Any provided files will be **appended** to the message. To remove or replace files you will have to supply the `attachments` field which specifies the files to retain on the message after edit.

> warn
> Starting with API v10, the `attachments` array must contain all attachments that should be present after edit, including **retained and new** attachments provided in the request body.

> info
> All parameters to this endpoint are optional and nullable.

###### JSON/Form Params

| Field            | Type                                                                                 | Description                                                                                                                             |
| ---------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| content          | string                                                                               | Message contents (up to 2000 characters)                                                                                                |
| embeds           | array of [embed](#DOCS_RESOURCES_CHANNEL/embed-object) objects                       | Embedded `rich` content (up to 6000 characters)                                                                                         |
| flags            | integer                                                                              | Edit the [flags](#DOCS_RESOURCES_CHANNEL/message-object-message-flags) of a message (only `SUPPRESS_EMBEDS` can currently be set/unset) |
| allowed_mentions | [allowed mention object](#DOCS_RESOURCES_CHANNEL/allowed-mentions-object)            | Allowed mentions for the message                                                                                                        |
| components       | array of [message component](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/component-object) | Components to include with the message                                                                                                  |
| files[n]         | file contents                                                                        | Contents of the file being sent/edited. See [Uploading Files](#DOCS_REFERENCE/uploading-files)                                          |
| payload_json     | string                                                                               | JSON-encoded body of non-file params (multipart/form-data only). See [Uploading Files](#DOCS_REFERENCE/uploading-files)                 |
| attachments      | array of [attachment](#DOCS_RESOURCES_CHANNEL/attachment-object) objects             | Attached files to keep and possible descriptions for new files. See [Uploading Files](#DOCS_REFERENCE/uploading-files)                  |


## Delete Message % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Delete a message. If operating on a guild channel and trying to delete a message that was not sent by the current user, this endpoint requires the `MANAGE_MESSAGES` permission. Returns a 204 empty response on success. Fires a [Message Delete](#DOCS_TOPICS_GATEWAY/message-delete) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.


## Bulk Delete Messages % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/bulk-delete

Delete multiple messages in a single request. This endpoint can only be used on guild channels and requires the `MANAGE_MESSAGES` permission. Returns a 204 empty response on success. Fires a [Message Delete Bulk](#DOCS_TOPICS_GATEWAY/message-delete-bulk) Gateway event.

Any message IDs given that do not exist or are invalid will count towards the minimum and maximum message count (currently 2 and 100 respectively).

> warn
> This endpoint will not delete messages older than 2 weeks, and will fail with a 400 BAD REQUEST if any message provided is older than that or if any duplicate message IDs are provided.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field    | Type                | Description                               |
| -------- | ------------------- | ----------------------------------------- |
| messages | array of snowflakes | an array of message ids to delete (2-100) |


## Edit Channel Permissions % PUT /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/permissions/{overwrite.id#DOCS_RESOURCES_CHANNEL/overwrite-object}

Edit the channel permission overwrites for a user or role in a channel. Only usable for guild channels. Requires the `MANAGE_ROLES` permission. Only permissions your bot has in the guild or parent channel (if applicable) can be allowed/denied (unless your bot has a `MANAGE_ROLES` overwrite in the channel). Returns a 204 empty response on success. For more information about permissions, see [permissions](#DOCS_TOPICS_PERMISSIONS/permissions).

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field  | Type    | Description                                                     |
| ------ | ------- | --------------------------------------------------------------- |
| allow? | string? | the bitwise value of all allowed permissions (default `"0"`)    |
| deny?  | string? | the bitwise value of all disallowed permissions (default `"0"`) |
| type   | integer | 0 for a role or 1 for a member                                  |


## Get Channel Invites % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/invites

Returns a list of [invite](#DOCS_RESOURCES_INVITE/invite-object) objects (with [invite metadata](#DOCS_RESOURCES_INVITE/invite-metadata-object)) for the channel. Only usable for guild channels. Requires the `MANAGE_CHANNELS` permission.


## Create Channel Invite % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/invites

Create a new [invite](#DOCS_RESOURCES_INVITE/invite-object) object for the channel. Only usable for guild channels. Requires the `CREATE_INSTANT_INVITE` permission. All JSON parameters for this route are optional, however the request body is not. If you are not sending any fields, you still have to send an empty JSON object (`{}`). Returns an [invite](#DOCS_RESOURCES_INVITE/invite-object) object. Fires an [Invite Create](#DOCS_TOPICS_GATEWAY/invite-create) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field                 | Type      | Description                                                                                                                               | Default          |
| --------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| max_age               | integer   | duration of invite in seconds before expiry, or 0 for never. between 0 and 604800 (7 days)                                                | 86400 (24 hours) |
| max_uses              | integer   | max number of uses or 0 for unlimited. between 0 and 100                                                                                  | 0                |
| temporary             | boolean   | whether this invite only grants temporary membership                                                                                      | false            |
| unique                | boolean   | if true, don't try to reuse a similar invite (useful for creating many unique one time use invites)                                       | false            |
| target_type           | integer   | the [type of target](#DOCS_RESOURCES_INVITE/invite-object-invite-target-types) for this voice channel invite                              |                  |
| target_user_id        | snowflake | the id of the user whose stream to display for this invite, required if `target_type` is 1, the user must be streaming in the channel     |                  |
| target_application_id | snowflake | the id of the embedded application to open for this invite, required if `target_type` is 2, the application must have the `EMBEDDED` flag |                  |


## Delete Channel Permission % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/permissions/{overwrite.id#DOCS_RESOURCES_CHANNEL/overwrite-object}

Delete a channel permission overwrite for a user or role in a channel. Only usable for guild channels. Requires the `MANAGE_ROLES` permission. Returns a 204 empty response on success. For more information about permissions, see [permissions](#DOCS_TOPICS_PERMISSIONS/permissions)

> info
> This endpoint supports the `X-Audit-Log-Reason` header.


## Follow Announcement Channel % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/followers

Follow an Announcement Channel to send messages to a target channel. Requires the `MANAGE_WEBHOOKS` permission in the target channel. Returns a [followed channel](#DOCS_RESOURCES_CHANNEL/followed-channel-object) object.

###### JSON Params

| Field              | Type      | Description          |
| ------------------ | --------- | -------------------- |
| webhook_channel_id | snowflake | id of target channel |


## Trigger Typing Indicator % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/typing

Post a typing indicator for the specified channel. Generally bots should **not** implement this route. However, if a bot is responding to a command and expects the computation to take a few seconds, this endpoint may be called to let the user know that the bot is processing their message. Returns a 204 empty response on success. Fires a [Typing Start](#DOCS_TOPICS_GATEWAY/typing-start) Gateway event.


## Get Pinned Messages % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/pins

Returns all pinned messages in the channel as an array of [message](#DOCS_RESOURCES_CHANNEL/message-object) objects.


## Pin Message % PUT /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/pins/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Pin a message in a channel. Requires the `MANAGE_MESSAGES` permission. Returns a 204 empty response on success.

> warn
> The max pinned messages is 50.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.


## Unpin Message % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/pins/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Unpin a message in a channel. Requires the `MANAGE_MESSAGES` permission. Returns a 204 empty response on success.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.


## Group DM Add Recipient % PUT /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/recipients/{user.id#DOCS_RESOURCES_USER/user-object}

Adds a recipient to a Group DM using their access token.

###### JSON Params

| Field        | Type   | Description                                                           |
| ------------ | ------ | --------------------------------------------------------------------- |
| access_token | string | access token of a user that has granted your app the `gdm.join` scope |
| nick         | string | nickname of the user being added                                      |


## Group DM Remove Recipient % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/recipients/{user.id#DOCS_RESOURCES_USER/user-object}

Removes a recipient from a Group DM.


## Start Thread from Message % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}/threads

Creates a new thread from an existing message. Returns a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) on success, and a 400 BAD REQUEST on invalid parameters. Fires a [Thread Create](#DOCS_TOPICS_GATEWAY/thread-create) Gateway event.

When called on a `GUILD_TEXT` channel, creates a `PUBLIC_THREAD`. When called on a `GUILD_ANNOUNCEMENT` channel, creates a `ANNOUNCEMENT_THREAD`. Does not work on a [`GUILD_FORUM`](#DOCS_RESOURCES_CHANNEL/start-thread-in-forum-channel) channel. The id of the created thread will be the same as the id of the source message, and as such a message can only have a single thread created from it.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field                  | Type     | Description                                                                                                                                |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| name                   | string   | 1-100 character channel name                                                                                                               |
| auto_archive_duration? | integer  | the thread will stop showing in the channel list after `auto_archive_duration` minutes of inactivity, can be set to: 60, 1440, 4320, 10080 |
| rate_limit_per_user?   | ?integer | amount of seconds a user has to wait before sending another message (0-21600)                                                              |


## Start Thread without Message % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/threads

Creates a new thread that is not connected to an existing message. Returns a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) on success, and a 400 BAD REQUEST on invalid parameters. Fires a [Thread Create](#DOCS_TOPICS_GATEWAY/thread-create) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

> info
> Creating a private thread requires the server to be boosted. The [guild features](#DOCS_RESOURCES_GUILD/guild-object-guild-features) will indicate if that is possible for the guild.

###### JSON Params

| Field                  | Type     | Description                                                                                                                                |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| name                   | string   | 1-100 character channel name                                                                                                               |
| auto_archive_duration? | integer  | the thread will stop showing in the channel list after `auto_archive_duration` minutes of inactivity, can be set to: 60, 1440, 4320, 10080 |
| type?\*                | integer  | the [type of thread](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types) to create                                                       |
| invitable?             | boolean  | whether non-moderators can add other non-moderators to a thread; only available when creating a private thread                             |
| rate_limit_per_user?   | ?integer | amount of seconds a user has to wait before sending another message (0-21600)                                                              |

\* `type` currently defaults to `GUILD_PRIVATE_THREAD` in order to match the behavior when thread documentation was first published. In a future API version this will be changed to be a required field, with no default.


## Start Thread in Forum Channel % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/threads

Creates a new thread in a forum channel, and sends a message within the created thread. Returns a [channel](#DOCS_RESOURCES_CHANNEL/channel-object), with a nested [message](#DOCS_RESOURCES_CHANNEL/message-object) object, on success, and a 400 BAD REQUEST on invalid parameters. Fires a [Thread Create](#DOCS_TOPICS_GATEWAY/thread-create) and [Message Create](#DOCS_TOPICS_GATEWAY/message-create) Gateway event.

- The type of the created thread is `PUBLIC_THREAD`.
- See [message formatting](#DOCS_REFERENCE/message-formatting) for more information on how to properly format messages.
- The current user must have the `SEND_MESSAGES` permission (`CREATE_PUBLIC_THREADS` is ignored).
- The maximum request size when sending a message is **8MiB**.
- For the embed object, you can set every field except `type` (it will be `rich` regardless of if you try to set it), `provider`, `video`, and any `height`, `width`, or `proxy_url` values for images.
- Examples for file uploads are available in [Uploading Files](#DOCS_REFERENCE/uploading-files).
- Files must be attached using a `multipart/form-data` body as described in [Uploading Files](#DOCS_REFERENCE/uploading-files).
- Note that when sending a message, you must provide a value for at **least one of** `content`, `embeds`, or `files[n]`.

> warn
> Discord may strip certain characters from message content, like invalid unicode characters or characters which cause unexpected message formatting. If you are passing user-generated strings into message content, consider sanitizing the data to prevent unexpected behavior and utilizing `allowed_mentions` to prevent unexpected mentions.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON/Form Params

| Field                    | Type                                                                                                                             | Description                                                                                                         |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| name                     | string                                                                                                                           | 1-100 character channel name                                                                                        |
| auto_archive_duration?\* | integer                                                                                                                          | duration in minutes to automatically archive the thread after recent activity, can be set to: 60, 1440, 4320, 10080 |
| rate_limit_per_user?     | ?integer                                                                                                                         | amount of seconds a user has to wait before sending another message (0-21600)                                       |
| message                  | a [forum thread message params](#DOCS_RESOURCES_CHANNEL/start-thread-in-forum-channel-forum-thread-message-params-object) object | contents of the first message in the forum thread                                                                   |
| applied_tags?            | array of snowflakes                                                                                                              | the IDs of the set of tags that have been applied to a thread in a `GUILD_FORUM` channel                            |


###### Forum Thread Message Params Object

> info
> When sending a message, apps must provide a value for **at least one of** `content`, `embeds`, `files[n]`, or `sticker_ids`.

| Field             | Type                                                                                         | Description                                                                                                                                                                 |
| ----------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| content?\*        | string                                                                                       | Message contents (up to 2000 characters)                                                                                                                                    |
| embeds?           | array of [embed](#DOCS_RESOURCES_CHANNEL/embed-object) objects                               | Embedded `rich` content (up to 6000 characters)                                                                                                                             |
| allowed_mentions? | [allowed mention object](#DOCS_RESOURCES_CHANNEL/allowed-mentions-object)                    | Allowed mentions for the message                                                                                                                                            |
| components?       | array of [message component](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/component-object) objects | Components to include with the message                                                                                                                                      |
| sticker_ids?\*    | array of snowflakes                                                                          | IDs of up to 3 [stickers](#DOCS_RESOURCES_STICKER/sticker-object) in the server to send in the message                                                                      |
| files[n]\*        | file contents                                                                                | Contents of the file being sent. See [Uploading Files](#DOCS_REFERENCE/uploading-files)                                                                                     |
| payload_json?     | string                                                                                       | JSON-encoded body of non-file params, only for `multipart/form-data` requests. See [Uploading Files](#DOCS_REFERENCE/uploading-files)                                       |
| attachments?      | array of partial [attachment](#DOCS_RESOURCES_CHANNEL/attachment-object) objects             | Attachment objects with `filename` and `description`. See [Uploading Files](#DOCS_REFERENCE/uploading-files)                                                                |
| flags?            | integer                                                                                      | [Message flags](#DOCS_RESOURCES_CHANNEL/message-object-message-flags) combined as a [bitfield](https://en.wikipedia.org/wiki/Bit_field) (only `SUPPRESS_EMBEDS` can be set) |

\* At least one of `content`, `embeds`, `files[n]`, or `sticker_ids` is required.


## Join Thread % PUT /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/thread-members/@me

Adds the current user to a thread. Also requires the thread is not archived. Returns a 204 empty response on success. Fires a [Thread Members Update](#DOCS_TOPICS_GATEWAY/thread-members-update) Gateway event.


## Add Thread Member % PUT /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/thread-members/{user.id#DOCS_RESOURCES_USER/user-object}

Adds another member to a thread. Requires the ability to send messages in the thread. Also requires the thread is not archived. Returns a 204 empty response if the member is successfully added or was already a member of the thread. Fires a [Thread Members Update](#DOCS_TOPICS_GATEWAY/thread-members-update) Gateway event.


## Leave Thread % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/thread-members/@me

Removes the current user from a thread. Also requires the thread is not archived. Returns a 204 empty response on success. Fires a [Thread Members Update](#DOCS_TOPICS_GATEWAY/thread-members-update) Gateway event.


## Remove Thread Member % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/thread-members/{user.id#DOCS_RESOURCES_USER/user-object}

Removes another member from a thread. Requires the `MANAGE_THREADS` permission, or the creator of the thread if it is a `GUILD_PRIVATE_THREAD`. Also requires the thread is not archived. Returns a 204 empty response on success. Fires a [Thread Members Update](#DOCS_TOPICS_GATEWAY/thread-members-update) Gateway event.


## Get Thread Member % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/thread-members/{user.id#DOCS_RESOURCES_USER/user-object}

Returns a [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) object for the specified user if they are a member of the thread, returns a 404 response otherwise.


## List Thread Members % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/thread-members

Returns array of [thread members](#DOCS_RESOURCES_CHANNEL/thread-member-object) objects that are members of the thread.

> warn
> This endpoint is restricted according to whether the `GUILD_MEMBERS` [Privileged Intent](#DOCS_TOPICS_GATEWAY/privileged-intents) is enabled for your application.


## List Public Archived Threads % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/threads/archived/public

Returns archived threads in the channel that are public. When called on a `GUILD_TEXT` channel, returns threads of [type](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types) `PUBLIC_THREAD`. When called on a `GUILD_ANNOUNCEMENT` channel returns threads of [type](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types) `ANNOUNCEMENT_THREAD`. Threads are ordered by `archive_timestamp`, in descending order. Requires the `READ_MESSAGE_HISTORY` permission.

###### Query String Params

| Field   | Type              | Description                                  |
| ------- | ----------------- | -------------------------------------------- |
| before? | ISO8601 timestamp | returns threads before this timestamp        |
| limit?  | integer           | optional maximum number of threads to return |

###### Response Body

| Field    | Type                                                                            | Description                                                                                  |
| -------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| threads  | array of [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects              | the public, archived threads                                                                 |
| members  | array of [thread members](#DOCS_RESOURCES_CHANNEL/thread-member-object) objects | a thread member object for each returned thread the current user has joined                  |
| has_more | boolean                                                                         | whether there are potentially additional threads that could be returned on a subsequent call |


## List Private Archived Threads % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/threads/archived/private

Returns archived threads in the channel that are of [type](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types) `GUILD_PRIVATE_THREAD`. Threads are ordered by `archive_timestamp`, in descending order. Requires both the `READ_MESSAGE_HISTORY` and `MANAGE_THREADS` permissions.

###### Query String Params

| Field   | Type              | Description                                  |
| ------- | ----------------- | -------------------------------------------- |
| before? | ISO8601 timestamp | returns threads before this timestamp        |
| limit?  | integer           | optional maximum number of threads to return |

###### Response Body

| Field    | Type                                                                            | Description                                                                                  |
| -------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| threads  | array of [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects              | the private, archived threads                                                                |
| members  | array of [thread members](#DOCS_RESOURCES_CHANNEL/thread-member-object) objects | a thread member object for each returned thread the current user has joined                  |
| has_more | boolean                                                                         | whether there are potentially additional threads that could be returned on a subsequent call |


## List Joined Private Archived Threads % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/users/@me/threads/archived/private

Returns archived threads in the channel that are of [type](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types) `GUILD_PRIVATE_THREAD`, and the user has joined. Threads are ordered by their `id`, in descending order. Requires the `READ_MESSAGE_HISTORY` permission.

###### Query String Params

| Field   | Type      | Description                                  |
| ------- | --------- | -------------------------------------------- |
| before? | snowflake | returns threads before this id               |
| limit?  | integer   | optional maximum number of threads to return |

###### Response Body

| Field    | Type                                                                            | Description                                                                                  |
| -------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| threads  | array of [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects              | the private, archived threads the current user has joined                                    |
| members  | array of [thread members](#DOCS_RESOURCES_CHANNEL/thread-member-object) objects | a thread member object for each returned thread the current user has joined                  |
| has_more | boolean                                                                         | whether there are potentially additional threads that could be returned on a subsequent call |


## List Guild Emojis % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/emojis

Returns a list of [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) objects for the given guild.


## Get Guild Emoji % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/emojis/{emoji.id#DOCS_RESOURCES_EMOJI/emoji-object}

Returns an [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) object for the given guild and emoji IDs.


## Create Guild Emoji % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/emojis

Create a new emoji for the guild. Requires the `MANAGE_EMOJIS_AND_STICKERS` permission. Returns the new [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) object on success. Fires a [Guild Emojis Update](#DOCS_TOPICS_GATEWAY/guild-emojis-update) Gateway event.

> warn
> Emojis and animated emojis have a maximum file size of 256kb. Attempting to upload an emoji larger than this limit will fail and return 400 Bad Request and an error message, but not a [JSON status code](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/json).

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field | Type                                     | Description                                    |
| ----- | ---------------------------------------- | ---------------------------------------------- |
| name  | string                                   | name of the emoji                              |
| image | [image data](#DOCS_REFERENCE/image-data) | the 128x128 emoji image                        |
| roles | array of snowflakes                      | roles allowed to use this emoji                |


## Modify Guild Emoji % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/emojis/{emoji.id#DOCS_RESOURCES_EMOJI/emoji-object}

Modify the given emoji. Requires the `MANAGE_EMOJIS_AND_STICKERS` permission. Returns the updated [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) object on success. Fires a [Guild Emojis Update](#DOCS_TOPICS_GATEWAY/guild-emojis-update) Gateway event.

> info
> All parameters to this endpoint are optional.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field | Type                 | Description                                   |
| ----- | -------------------- | --------------------------------------------- |
| name  | string               | name of the emoji                             |
| roles | ?array of snowflakes | roles allowed to use this emoji               |


## Delete Guild Emoji % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/emojis/{emoji.id#DOCS_RESOURCES_EMOJI/emoji-object}

Delete the given emoji. Requires the `MANAGE_EMOJIS_AND_STICKERS` permission. Returns `204 No Content` on success. Fires a [Guild Emojis Update](#DOCS_TOPICS_GATEWAY/guild-emojis-update) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.


## Create Guild % POST /guilds

Create a new guild. Returns a [guild](#DOCS_RESOURCES_GUILD/guild-object) object on success. Fires a [Guild Create](#DOCS_TOPICS_GATEWAY/guild-create) Gateway event.

> warn
> This endpoint can be used only by bots in less than 10 guilds.

###### JSON Params

| Field                          | Type                                                                       | Description                                                                                                 |
| ------------------------------ | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| name                           | string                                                                     | name of the guild (2-100 characters)                                                                        |
| region?                        | ?string                                                                    | [voice region](#DOCS_RESOURCES_VOICE/voice-region-object) id (deprecated)                                    |
| icon?                          | [image data](#DOCS_REFERENCE/image-data)                                   | base64 128x128 image for the guild icon                                                                     |
| verification_level?            | integer                                                                    | [verification level](#DOCS_RESOURCES_GUILD/guild-object-verification-level)                                 |
| default_message_notifications? | integer                                                                    | default [message notification level](#DOCS_RESOURCES_GUILD/guild-object-default-message-notification-level) |
| explicit_content_filter?       | integer                                                                    | [explicit content filter level](#DOCS_RESOURCES_GUILD/guild-object-explicit-content-filter-level)           |
| roles?                         | array of [role](#DOCS_TOPICS_PERMISSIONS/role-object) objects              | new guild roles                                                                                             |
| channels?                      | array of partial [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects | new guild's channels                                                                                        |
| afk_channel_id?                | snowflake                                                                  | id for afk channel                                                                                          |
| afk_timeout?                   | integer                                                                    | afk timeout in seconds                                                                                      |
| system_channel_id?             | snowflake                                                                  | the id of the channel where guild notices such as welcome messages and boost events are posted              |
| system_channel_flags?          | integer                                                                    | [system channel flags](#DOCS_RESOURCES_GUILD/guild-object-system-channel-flags)                             |

> warn
> When using the `roles` parameter, the first member of the array is used to change properties of the guild's `@everyone` role. If you are trying to bootstrap a guild with additional roles, keep this in mind.

> info
> When using the `roles` parameter, the required `id` field within each role object is an integer placeholder, and will be replaced by the API upon consumption. Its purpose is to allow you to [overwrite](#DOCS_RESOURCES_CHANNEL/overwrite-object) a role's permissions in a channel when also passing in channels with the channels array.

> warn
> When using the `channels` parameter, the `position` field is ignored, and none of the default channels are created.

> info
> When using the `channels` parameter, the `id` field within each channel object may be set to an integer placeholder, and will be replaced by the API upon consumption. Its purpose is to allow you to create `GUILD_CATEGORY` channels by setting the `parent_id` field on any children to the category's `id` field. Category channels must be listed before any children.

> warn
> The `region` field is deprecated and is replaced by [channel.rtc_region](#DOCS_RESOURCES_CHANNEL/channel-object-channel-structure).

###### Example Partial Channel Object

```json
{
  "name": "naming-things-is-hard",
  "type": 0
}
```

###### Example Category Channel

```json
{
  "name": "my-category",
  "type": 4,
  "id": 1
}
{
  "name": "naming-things-is-hard",
  "type": 0,
  "id": 2,
  "parent_id": 1
}
```


## Get Guild % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}

Returns the [guild](#DOCS_RESOURCES_GUILD/guild-object) object for the given id. If `with_counts` is set to `true`, this endpoint will also return `approximate_member_count` and `approximate_presence_count` for the guild.

###### Query String Params

| Field        | Type    | Description                                                                   | Required | Default |
| ------------ | ------- | ----------------------------------------------------------------------------- | -------- | ------- |
| with_counts? | boolean | when `true`, will return approximate member and presence counts for the guild | false    | false   |

###### Example Response

```json
{
  "id": "2909267986263572999",
  "name": "Mason's Test Server",
  "icon": "389030ec9db118cb5b85a732333b7c98",
  "description": null,
  "splash": "75610b05a0dd09ec2c3c7df9f6975ea0",
  "discovery_splash": null,
  "approximate_member_count": 2,
  "approximate_presence_count": 2,
  "features": [
    "INVITE_SPLASH",
    "VANITY_URL",
    "COMMERCE",
    "BANNER",
    "NEWS",
    "VERIFIED",
    "VIP_REGIONS"
  ],
  "emojis": [
    {
      "name": "ultrafastparrot",
      "roles": [],
      "id": "393564762228785161",
      "require_colons": true,
      "managed": false,
      "animated": true,
      "available": true
    }
  ],
  "banner": "5c3cb8d1bc159937fffe7e641ec96ca7",
  "owner_id": "53908232506183680",
  "application_id": null,
  "region": null,
  "afk_channel_id": null,
  "afk_timeout": 300,
  "system_channel_id": null,
  "widget_enabled": true,
  "widget_channel_id": "639513352485470208",
  "verification_level": 0,
  "roles": [
    {
      "id": "2909267986263572999",
      "name": "@everyone",
      "permissions": "49794752",
      "position": 0,
      "color": 0,
      "hoist": false,
      "managed": false,
      "mentionable": false
    }
  ],
  "default_message_notifications": 1,
  "mfa_level": 0,
  "explicit_content_filter": 0,
  "max_presences": null,
  "max_members": 250000,
  "max_video_channel_users": 25,
  "vanity_url_code": "no",
  "premium_tier": 0,
  "premium_subscription_count": 0,
  "system_channel_flags": 0,
  "preferred_locale": "en-US",
  "rules_channel_id": null,
  "public_updates_channel_id": null
}
```


## Get Guild Preview % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/preview

Returns the [guild preview](#DOCS_RESOURCES_GUILD/guild-preview-object) object for the given id. If the user is not in the guild, then the guild must be lurkable.


## Modify Guild % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}

Modify a guild's settings. Requires the `MANAGE_GUILD` permission. Returns the updated [guild](#DOCS_RESOURCES_GUILD/guild-object) object on success. Fires a [Guild Update](#DOCS_TOPICS_GATEWAY/guild-update) Gateway event.

> info
> All parameters to this endpoint are optional

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

> warn
> Attempting to add or remove the `COMMUNITY` [guild feature](#DOCS_RESOURCES_GUILD/guild-object-guild-features) requires the `ADMINISTRATOR` permission.

###### JSON Params

| Field                         | Type                                                                                | Description                                                                                                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name                          | string                                                                              | guild name                                                                                                                                                        |
| region                        | ?string                                                                             | guild [voice region](#DOCS_RESOURCES_VOICE/voice-region-object) id (deprecated)                                                                                   |
| verification_level            | ?integer                                                                            | [verification level](#DOCS_RESOURCES_GUILD/guild-object-verification-level)                                                                                       |
| default_message_notifications | ?integer                                                                            | default [message notification level](#DOCS_RESOURCES_GUILD/guild-object-default-message-notification-level)                                                       |
| explicit_content_filter       | ?integer                                                                            | [explicit content filter level](#DOCS_RESOURCES_GUILD/guild-object-explicit-content-filter-level)                                                                 |
| afk_channel_id                | ?snowflake                                                                          | id for afk channel                                                                                                                                                |
| afk_timeout                   | integer                                                                             | afk timeout in seconds                                                                                                                                            |
| icon                          | ?[image data](#DOCS_REFERENCE/image-data)                                           | base64 1024x1024 png/jpeg/gif image for the guild icon (can be animated gif when the server has the `ANIMATED_ICON` feature)                                      |
| owner_id                      | snowflake                                                                           | user id to transfer guild ownership to (must be owner)                                                                                                            |
| splash                        | ?[image data](#DOCS_REFERENCE/image-data)                                           | base64 16:9 png/jpeg image for the guild splash (when the server has the `INVITE_SPLASH` feature)                                                                 |
| discovery_splash              | ?[image data](#DOCS_REFERENCE/image-data)                                           | base64 16:9 png/jpeg image for the guild discovery splash (when the server has the `DISCOVERABLE` feature)                                                        |
| banner                        | ?[image data](#DOCS_REFERENCE/image-data)                                           | base64 16:9 png/jpeg image for the guild banner (when the server has the `BANNER` feature; can be animated gif when the server has the `ANIMATED_BANNER` feature) |
| system_channel_id             | ?snowflake                                                                          | the id of the channel where guild notices such as welcome messages and boost events are posted                                                                    |
| system_channel_flags          | integer                                                                             | [system channel flags](#DOCS_RESOURCES_GUILD/guild-object-system-channel-flags)                                                                                   |
| rules_channel_id              | ?snowflake                                                                          | the id of the channel where Community guilds display rules and/or guidelines                                                                                      |
| public_updates_channel_id     | ?snowflake                                                                          | the id of the channel where admins and moderators of Community guilds receive notices from Discord                                                                |
| preferred_locale              | ?string                                                                             | the preferred [locale](#DOCS_REFERENCE/locales) of a Community guild used in server discovery and notices from Discord; defaults to "en-US"                       |
| features                      | array of [guild feature](#DOCS_RESOURCES_GUILD/guild-object-guild-features) strings | enabled guild features                                                                                                                                            |
| description                   | ?string                                                                             | the description for the guild                                                                                                                                     |
| premium_progress_bar_enabled  | boolean                                                                             | whether the guild's boost progress bar should be enabled                                                                                                          |


## Delete Guild % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}

Delete a guild permanently. User must be owner. Returns `204 No Content` on success. Fires a [Guild Delete](#DOCS_TOPICS_GATEWAY/guild-delete) Gateway event.


## Get Guild Channels % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/channels

Returns a list of guild [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects. Does not include threads.


## Create Guild Channel % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/channels

Create a new [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object for the guild. Requires the `MANAGE_CHANNELS` permission. If setting permission overwrites, only permissions your bot has in the guild can be allowed/denied. Setting `MANAGE_ROLES` permission in channels is only possible for guild administrators. Returns the new [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object on success. Fires a [Channel Create](#DOCS_TOPICS_GATEWAY/channel-create) Gateway event.

> info
> All parameters to this endpoint are optional and nullable excluding `name`

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field                         | Type                                                                           | Description                                                                                                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name                          | string                                                                         | channel name (1-100 characters)                                                                                                                                                 |
| type                          | integer                                                                        | the [type of channel](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types)                                                                                                     |
| topic                         | string                                                                         | channel topic (0-1024 characters)                                                                                                                                               |
| bitrate\*                     | integer                                                                        | the bitrate (in bits) of the voice or stage channel; min 8000                                                                                                                   |
| user_limit                    | integer                                                                        | the user limit of the voice channel                                                                                                                                             |
| rate_limit_per_user           | integer                                                                        | amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission `manage_messages` or `manage_channel`, are unaffected |
| position                      | integer                                                                        | sorting position of the channel                                                                                                                                                 |
| permission_overwrites\*\*     | array of partial [overwrite](#DOCS_RESOURCES_CHANNEL/overwrite-object) objects | the channel's permission overwrites                                                                                                                                             |
| parent_id                     | snowflake                                                                      | id of the parent category for a channel                                                                                                                                         |
| nsfw                          | boolean                                                                        | whether the channel is nsfw                                                                                                                                                     |
| rtc_region                    | string                                                                         | channel [voice region](#DOCS_RESOURCES_VOICE/voice-region-object) id of the voice or stage channel, automatic when set to null                                                  |
| video_quality_mode            | integer                                                                        | the camera [video quality mode](#DOCS_RESOURCES_CHANNEL/channel-object-video-quality-modes) of the voice channel                                                                |
| default_auto_archive_duration | integer                                                                        | the default duration that the clients use (not the API) for newly created threads in the channel, in minutes, to automatically archive the thread after recent activity         |

\* For voice channels, normal servers can set bitrate up to 96000, servers with Boost level 1 can set up to 128000, servers with Boost level 2 can set up to 256000, and servers with Boost level 3 or the `VIP_REGIONS` [guild feature](#DOCS_RESOURCES_GUILD/guild-object-guild-features) can set up to 384000. For stage channels, bitrate can be set up to 64000.

\*\* In each overwrite object, the `allow` and `deny` keys can be omitted or set to `null`, which both default to `"0"`.


## Modify Guild Channel Positions % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/channels

Modify the positions of a set of [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects for the guild. Requires `MANAGE_CHANNELS` permission. Returns a 204 empty response on success. Fires multiple [Channel Update](#DOCS_TOPICS_GATEWAY/channel-update) Gateway events.

> info
> Only channels to be modified are required.

This endpoint takes a JSON array of parameters in the following format:

###### JSON Params

| Field            | Type       | Description                                                                      |
| ---------------- | ---------- | -------------------------------------------------------------------------------- |
| id               | snowflake  | channel id                                                                       |
| position         | ?integer   | sorting position of the channel                                                  |
| lock_permissions | ?boolean   | syncs the permission overwrites with the new parent, if moving to a new category |
| parent_id        | ?snowflake | the new parent ID for the channel that is moved                                  |


## List Active Guild Threads % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/threads/active

Returns all active threads in the guild, including public and private threads. Threads are ordered by their `id`, in descending order.

###### Response Body

| Field    | Type                                                                            | Description                                                                                  |
|----------|---------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| threads  | array of [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects              | the active threads                                                                           |
| members  | array of [thread members](#DOCS_RESOURCES_CHANNEL/thread-member-object) objects | a thread member object for each returned thread the current user has joined                  |


## Get Guild Member % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/{user.id#DOCS_RESOURCES_USER/user-object}

Returns a [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) object for the specified user.


## List Guild Members % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members

Returns a list of [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) objects that are members of the guild.

> warn
> This endpoint is restricted according to whether the `GUILD_MEMBERS` [Privileged Intent](#DOCS_TOPICS_GATEWAY/privileged-intents) is enabled for your application.

> info
> All parameters to this endpoint are optional

###### Query String Params

| Field | Type      | Description                              | Default |
| ----- | --------- | ---------------------------------------- | ------- |
| limit | integer   | max number of members to return (1-1000) | 1       |
| after | snowflake | the highest user id in the previous page | 0       |


## Search Guild Members % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/search

Returns a list of [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) objects whose username or nickname starts with a provided string.

> info
> All parameters to this endpoint except for `query` are optional

###### Query String Params

| Field | Type    | Description                                                | Default |
| ----- | ------- | ---------------------------------------------------------- | ------- |
| query | string  | Query string to match username(s) and nickname(s) against. |         |
| limit | integer | max number of members to return (1-1000)                   | 1       |


## Add Guild Member % PUT /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/{user.id#DOCS_RESOURCES_USER/user-object}

Adds a user to the guild, provided you have a valid oauth2 access token for the user with the `guilds.join` scope. Returns a 201 Created with the [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) as the body, or 204 No Content if the user is already a member of the guild. Fires a [Guild Member Add](#DOCS_TOPICS_GATEWAY/guild-member-add) Gateway event.

For guilds with [Membership Screening](#DOCS_RESOURCES_GUILD/membership-screening-object) enabled, this endpoint will default to adding new members as `pending` in the [guild member object](#DOCS_RESOURCES_GUILD/guild-member-object). Members that are `pending` will have to complete membership screening before they become full members that can talk.

> info
> All parameters to this endpoint except for `access_token` are optional.

> info
> The Authorization header must be a Bot token (belonging to the same application used for authorization), and the bot must be a member of the guild with `CREATE_INSTANT_INVITE` permission.

###### JSON Params

| Field        | Type                | Description                                                                                                              | Permission       |
| ------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| access_token | string              | an oauth2 access token granted with the `guilds.join` to the bot's application for the user you want to add to the guild |                  |
| nick         | string              | value to set user's nickname to                                                                                          | MANAGE_NICKNAMES |
| roles        | array of snowflakes | array of role ids the member is assigned                                                                                 | MANAGE_ROLES     |
| mute         | boolean             | whether the user is muted in voice channels                                                                              | MUTE_MEMBERS     |
| deaf         | boolean             | whether the user is deafened in voice channels                                                                           | DEAFEN_MEMBERS   |

> warn
> For guilds with Membership Screening enabled, assigning a role using the `roles` parameter will add the user to the guild as a full member (`pending` is false in the [member object](#DOCS_RESOURCES_GUILD/guild-member-object)). A member with a role will bypass membership screening and the guild's verification level, and get immediate access to chat. Therefore, instead of assigning a role when the member joins, it is recommended to grant roles only after the user completes screening.


## Modify Guild Member % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/{user.id#DOCS_RESOURCES_USER/user-object}

Modify attributes of a [guild member](#DOCS_RESOURCES_GUILD/guild-member-object). Returns a 200 OK with the [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) as the body. Fires a [Guild Member Update](#DOCS_TOPICS_GATEWAY/guild-member-update) Gateway event. If the `channel_id` is set to null, this will force the target user to be disconnected from voice.

> info
> All parameters to this endpoint are optional and nullable. When moving members to channels, the API user _must_ have permissions to both connect to the channel and have the `MOVE_MEMBERS` permission.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field                        | Type                | Description                                                                                                                                                                                                                              | Permission       |
| ---------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| nick                         | string              | value to set user's nickname to                                                                                                                                                                                                                                                                                                                   | MANAGE_NICKNAMES |
| roles                        | array of snowflakes | array of role ids the member is assigned                                                                                                                                                                                                                                                                                                         | MANAGE_ROLES     |
| mute                         | boolean             | whether the user is muted in voice channels. Will throw a 400 error if the user is not in a voice channel                                                                                                                                                                                                                                         | MUTE_MEMBERS     |
| deaf                         | boolean             | whether the user is deafened in voice channels. Will throw a 400 error if the user is not in a voice channel                                                                                                                                                                                                                                     | DEAFEN_MEMBERS   |
| channel_id                   | snowflake           | id of channel to move user to (if they are connected to voice)                                                                                                                                                                                                                                                                                   | MOVE_MEMBERS     |
| communication_disabled_until | ISO8601 timestamp  | when the user's [timeout](https://support.discord.com/hc/en-us/articles/4413305239191-Time-Out-FAQ) will expire and the user will be able to communicate in the guild again (up to 28 days in the future), set to null to remove timeout. Will throw a 403 error if the user has the ADMINISTRATOR permission or is the owner of the guild | MODERATE_MEMBERS |


## Modify Current Member % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/@me

Modifies the current member in a guild. Returns a 200 with the updated member object on success. Fires a [Guild Member Update](#DOCS_TOPICS_GATEWAY/guild-member-update) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field | Type    | Description                     | Permission      |
| ----- | ------- | ------------------------------- | --------------- |
| nick? | ?string | value to set user's nickname to | CHANGE_NICKNAME |


## Modify Current User Nick % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/@me/nick

> danger
> Deprecated in favor of [Modify Current Member](#DOCS_RESOURCES_GUILD/modify-current-member).

Modifies the nickname of the current user in a guild. Returns a 200 with the nickname on success. Fires a [Guild Member Update](#DOCS_TOPICS_GATEWAY/guild-member-update) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field | Type    | Description                     | Permission      |
| ----- | ------- | ------------------------------- | --------------- |
| nick? | ?string | value to set user's nickname to | CHANGE_NICKNAME |


## Add Guild Member Role % PUT /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/{user.id#DOCS_RESOURCES_USER/user-object}/roles/{role.id#DOCS_TOPICS_PERMISSIONS/role-object}

Adds a role to a [guild member](#DOCS_RESOURCES_GUILD/guild-member-object). Requires the `MANAGE_ROLES` permission. Returns a 204 empty response on success. Fires a [Guild Member Update](#DOCS_TOPICS_GATEWAY/guild-member-update) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.


## Remove Guild Member Role % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/{user.id#DOCS_RESOURCES_USER/user-object}/roles/{role.id#DOCS_TOPICS_PERMISSIONS/role-object}

Removes a role from a [guild member](#DOCS_RESOURCES_GUILD/guild-member-object). Requires the `MANAGE_ROLES` permission. Returns a 204 empty response on success. Fires a [Guild Member Update](#DOCS_TOPICS_GATEWAY/guild-member-update) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.


## Remove Guild Member % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/{user.id#DOCS_RESOURCES_USER/user-object}

Remove a member from a guild. Requires `KICK_MEMBERS` permission. Returns a 204 empty response on success. Fires a [Guild Member Remove](#DOCS_TOPICS_GATEWAY/guild-member-remove) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.


## Get Guild Bans % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/bans

Returns a list of [ban](#DOCS_RESOURCES_GUILD/ban-object) objects for the users banned from this guild. Requires the `BAN_MEMBERS` permission.

###### Query String Params

| Field        | Type      | Description                                                                    | Default |
| ------------ | -------   | ------------------------------------------------------------------------------ | ------- |
| limit?       | number    | number of users to return (up to maximum 1000)                                 | 1000    |
| before? *    | snowflake | consider only users before given user id                                       | null    |
| after? *     | snowflake | consider only users after given user id                                        | null    |

\* Provide a user id to `before` and `after` for pagination. Users will always be returned in ascending order by `user.id`. If both `before` and `after` are provided, only `before` is respected.


## Get Guild Ban % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/bans/{user.id#DOCS_RESOURCES_USER/user-object}

Returns a [ban](#DOCS_RESOURCES_GUILD/ban-object) object for the given user or a 404 not found if the ban cannot be found. Requires the `BAN_MEMBERS` permission.


## Create Guild Ban % PUT /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/bans/{user.id#DOCS_RESOURCES_USER/user-object}

Create a guild ban, and optionally delete previous messages sent by the banned user. Requires the `BAN_MEMBERS` permission. Returns a 204 empty response on success. Fires a [Guild Ban Add](#DOCS_TOPICS_GATEWAY/guild-ban-add) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field                   | Type    | Description                                                             | Default |
| ----------------------- | ------- | ----------------------------------------------------------------------- | ------- |
| delete_message_days?    | integer | number of days to delete messages for (0-7) (deprecated)                | 0       |
| delete_message_seconds? | integer | number of seconds to delete messages for, between 0 and 604800 (7 days) | 0       |


## Remove Guild Ban % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/bans/{user.id#DOCS_RESOURCES_USER/user-object}

Remove the ban for a user. Requires the `BAN_MEMBERS` permissions. Returns a 204 empty response on success. Fires a [Guild Ban Remove](#DOCS_TOPICS_GATEWAY/guild-ban-remove) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.


## Get Guild Roles % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/roles

Returns a list of [role](#DOCS_TOPICS_PERMISSIONS/role-object) objects for the guild.


## Create Guild Role % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/roles

Create a new [role](#DOCS_TOPICS_PERMISSIONS/role-object) for the guild. Requires the `MANAGE_ROLES` permission. Returns the new [role](#DOCS_TOPICS_PERMISSIONS/role-object) object on success. Fires a [Guild Role Create](#DOCS_TOPICS_GATEWAY/guild-role-create) Gateway event. All JSON params are optional.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field         | Type                                      | Description                                                                                                                    | Default                        |
| ------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ |
| name          | string                                    | name of the role                                                                                                               | "new role"                     |
| permissions   | string                                    | bitwise value of the enabled/disabled permissions                                                                              | @everyone permissions in guild |
| color         | integer                                   | RGB color value                                                                                                                | 0                              |
| hoist         | boolean                                   | whether the role should be displayed separately in the sidebar                                                                 | false                          |
| icon          | ?[image data](#DOCS_REFERENCE/image-data) | the role's icon image (if the guild has the `ROLE_ICONS` feature)                                                              | null                           |
| unicode_emoji | ?string                                   | the role's unicode emoji as a [standard emoji](#DOCS_REFERENCE/message-formatting) (if the guild has the `ROLE_ICONS` feature) | null                           |
| mentionable   | boolean                                   | whether the role should be mentionable                                                                                         | false                          |


## Modify Guild Role Positions % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/roles

Modify the positions of a set of [role](#DOCS_TOPICS_PERMISSIONS/role-object) objects for the guild. Requires the `MANAGE_ROLES` permission. Returns a list of all of the guild's [role](#DOCS_TOPICS_PERMISSIONS/role-object) objects on success. Fires multiple [Guild Role Update](#DOCS_TOPICS_GATEWAY/guild-role-update) Gateway events.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

This endpoint takes a JSON array of parameters in the following format:

###### JSON Params

| Field     | Type      | Description                  |
| --------- | --------- | ---------------------------- |
| id        | snowflake | role                         |
| position? | ?integer  | sorting position of the role |


## Modify Guild Role % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/roles/{role.id#DOCS_TOPICS_PERMISSIONS/role-object}

Modify a guild role. Requires the `MANAGE_ROLES` permission. Returns the updated [role](#DOCS_TOPICS_PERMISSIONS/role-object) on success. Fires a [Guild Role Update](#DOCS_TOPICS_GATEWAY/guild-role-update) Gateway event.

> info
> All parameters to this endpoint are optional and nullable.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field         | Type                                     | Description                                                                                                                    |
| ------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| name          | string                                   | name of the role                                                                                                               |
| permissions   | string                                   | bitwise value of the enabled/disabled permissions                                                                              |
| color         | integer                                  | RGB color value                                                                                                                |
| hoist         | boolean                                  | whether the role should be displayed separately in the sidebar                                                                 |
| icon          | [image data](#DOCS_REFERENCE/image-data) | the role's icon image (if the guild has the `ROLE_ICONS` feature)                                                              |
| unicode_emoji | string                                   | the role's unicode emoji as a [standard emoji](#DOCS_REFERENCE/message-formatting) (if the guild has the `ROLE_ICONS` feature) |
| mentionable   | boolean                                  | whether the role should be mentionable                                                                                         |


## Modify Guild MFA Level % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/mfa

Modify a guild's MFA level. Requires guild ownership. Returns the updated [level](#DOCS_RESOURCES_GUILD/guild-object-mfa-level) on success. Fires a [Guild Update](#DOCS_TOPICS_GATEWAY/guild-update) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field         | Type                                     | Description                                                                                                                    |
| ------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| level         | integer                                  | [MFA level](#DOCS_RESOURCES_GUILD/guild-object-mfa-level)                                                                      |


## Delete Guild Role % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/roles/{role.id#DOCS_TOPICS_PERMISSIONS/role-object}

Delete a guild role. Requires the `MANAGE_ROLES` permission. Returns a 204 empty response on success. Fires a [Guild Role Delete](#DOCS_TOPICS_GATEWAY/guild-role-delete) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.


## Get Guild Prune Count % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/prune

Returns an object with one `pruned` key indicating the number of members that would be removed in a prune operation. Requires the `KICK_MEMBERS` permission.

By default, prune will not remove users with roles. You can optionally include specific roles in your prune by providing the `include_roles` parameter. Any inactive user that has a subset of the provided role(s) will be counted in the prune and users with additional roles will not.

###### Query String Params

| Field         | Type                                        | Description                              | Default |
| ------------- | ------------------------------------------- | ---------------------------------------- | ------- |
| days          | integer                                     | number of days to count prune for (1-30) | 7       |
| include_roles | string; comma-delimited array of snowflakes | role(s) to include                       | none    |


## Begin Guild Prune % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/prune

Begin a prune operation. Requires the `KICK_MEMBERS` permission. Returns an object with one `pruned` key indicating the number of members that were removed in the prune operation. For large guilds it's recommended to set the `compute_prune_count` option to `false`, forcing `pruned` to `null`. Fires multiple [Guild Member Remove](#DOCS_TOPICS_GATEWAY/guild-member-remove) Gateway events.

By default, prune will not remove users with roles. You can optionally include specific roles in your prune by providing the `include_roles` parameter. Any inactive user that has a subset of the provided role(s) will be included in the prune and users with additional roles will not.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field               | Type                | Description                                                | Default |
| ------------------- | ------------------- | ---------------------------------------------------------- | ------- |
| days                | integer             | number of days to prune (1-30)                             | 7       |
| compute_prune_count | boolean             | whether `pruned` is returned, discouraged for large guilds | true    |
| include_roles       | array of snowflakes | role(s) to include                                         | none    |
| reason?             | string              | reason for the prune (deprecated)                          |         |


## Get Guild Voice Regions % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/regions

Returns a list of [voice region](#DOCS_RESOURCES_VOICE/voice-region-object) objects for the guild. Unlike the similar `/voice` route, this returns VIP servers when the guild is VIP-enabled.


## Get Guild Invites % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/invites

Returns a list of [invite](#DOCS_RESOURCES_INVITE/invite-object) objects (with [invite metadata](#DOCS_RESOURCES_INVITE/invite-metadata-object)) for the guild. Requires the `MANAGE_GUILD` permission.


## Get Guild Integrations % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/integrations

Returns a list of [integration](#DOCS_RESOURCES_GUILD/integration-object) objects for the guild. Requires the `MANAGE_GUILD` permission.


## Delete Guild Integration % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/integrations/{integration.id#DOCS_RESOURCES_GUILD/integration-object}

Delete the attached [integration](#DOCS_RESOURCES_GUILD/integration-object) object for the guild. Deletes any associated webhooks and kicks the associated bot if there is one. Requires the `MANAGE_GUILD` permission. Returns a 204 empty response on success. Fires a [Guild Integrations Update](#DOCS_TOPICS_GATEWAY/guild-integrations-update) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.


## Get Guild Widget Settings % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/widget

Returns a [guild widget settings](#DOCS_RESOURCES_GUILD/guild-widget-settings-object) object. Requires the `MANAGE_GUILD` permission.


## Modify Guild Widget % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/widget

Modify a [guild widget settings](#DOCS_RESOURCES_GUILD/guild-widget-settings-object) object for the guild. All attributes may be passed in with JSON and modified. Requires the `MANAGE_GUILD` permission. Returns the updated [guild widget](#DOCS_RESOURCES_GUILD/guild-widget-settings-object) object.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.


## Get Guild Widget % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/widget.json

Returns the [widget](#DOCS_RESOURCES_GUILD/guild-widget-object) for the guild.


## Get Guild Vanity URL % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/vanity-url

Returns a partial [invite](#DOCS_RESOURCES_INVITE/invite-object) object for guilds with that feature enabled. Requires the `MANAGE_GUILD` permission. `code` will be null if a vanity url for the guild is not set.

###### Example Partial Invite Object

```json
{
  "code": "abc",
  "uses": 12
}
```


## Get Guild Widget Image % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/widget.png

Returns a PNG image widget for the guild. Requires no permissions or authentication.

> info
> All parameters to this endpoint are optional.

###### Query String Params

| Field | Type   | Description                                    | Default |
| ----- | ------ | ---------------------------------------------- | ------- |
| style | string | style of the widget image returned (see below) | shield  |

###### Widget Style Options

| Value   | Description                                                                                                                                                    | Example                                                                              |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| shield  | shield style widget with Discord icon and guild members online count                                                                                           | [Example](https://discord.com/api/guilds/81384788765712384/widget.png?style=shield)  |
| banner1 | large image with guild icon, name and online count. "POWERED BY DISCORD" as the footer of the widget                                                           | [Example](https://discord.com/api/guilds/81384788765712384/widget.png?style=banner1) |
| banner2 | smaller widget style with guild icon, name and online count. Split on the right with Discord logo                                                              | [Example](https://discord.com/api/guilds/81384788765712384/widget.png?style=banner2) |
| banner3 | large image with guild icon, name and online count. In the footer, Discord logo on the left and "Chat Now" on the right                                        | [Example](https://discord.com/api/guilds/81384788765712384/widget.png?style=banner3) |
| banner4 | large Discord logo at the top of the widget. Guild icon, name and online count in the middle portion of the widget and a "JOIN MY SERVER" button at the bottom | [Example](https://discord.com/api/guilds/81384788765712384/widget.png?style=banner4) |


## Get Guild Welcome Screen % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/welcome-screen

Returns the [Welcome Screen](#DOCS_RESOURCES_GUILD/welcome-screen-object) object for the guild. If the welcome screen is not enabled, the `MANAGE_GUILD` permission is required.


## Modify Guild Welcome Screen % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/welcome-screen

Modify the guild's [Welcome Screen](#DOCS_RESOURCES_GUILD/welcome-screen-object). Requires the `MANAGE_GUILD` permission. Returns the updated [Welcome Screen](#DOCS_RESOURCES_GUILD/welcome-screen-object) object.

> info
> All parameters to this endpoint are optional and nullable

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field            | Type                                                                                                                    | Description                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| enabled          | boolean                                                                                                                 | whether the welcome screen is enabled                           |
| welcome_channels | array of [welcome screen channel](#DOCS_RESOURCES_GUILD/welcome-screen-object-welcome-screen-channel-structure) objects | channels linked in the welcome screen and their display options |
| description      | string                                                                                                                  | the server description to show in the welcome screen            |


## Modify Current User Voice State % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/voice-states/@me

Updates the current user's voice state. Returns `204 No Content` on success.

###### JSON Params

| Field                       | Type               | Description                                    |
| --------------------------- | ------------------ | ---------------------------------------------- |
| channel_id?                 | snowflake          | the id of the channel the user is currently in |
| suppress?                   | boolean            | toggles the user's suppress state              |
| request_to_speak_timestamp? | ?ISO8601 timestamp | sets the user's request to speak               |

###### Caveats

There are currently several caveats for this endpoint:

- `channel_id` must currently point to a stage channel.
- current user must already have joined `channel_id`.
- You must have the `MUTE_MEMBERS` permission to unsuppress yourself. You can always suppress yourself.
- You must have the `REQUEST_TO_SPEAK` permission to request to speak. You can always clear your own request to speak.
- You are able to set `request_to_speak_timestamp` to any present or future time.


## Modify User Voice State % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/voice-states/{user.id#DOCS_RESOURCES_USER/user-object}

Updates another user's voice state.

###### JSON Params

| Field      | Type      | Description                                    |
| ---------- | --------- | ---------------------------------------------- |
| channel_id | snowflake | the id of the channel the user is currently in |
| suppress?  | boolean   | toggles the user's suppress state              |

###### Caveats

There are currently several caveats for this endpoint:

- `channel_id` must currently point to a stage channel.
- User must already have joined `channel_id`.
- You must have the `MUTE_MEMBERS` permission. (Since suppression is the only thing that is available currently.)
- When unsuppressed, non-bot users will have their `request_to_speak_timestamp` set to the current time. Bot users will not.
- When suppressed, the user will have their `request_to_speak_timestamp` removed.


## List Scheduled Events for Guild % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/scheduled-events

Returns a list of [guild scheduled event](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object) objects for the given guild.

###### Query String Params

| Field            | Type    | Description                                      |
| ---------------- | ------- | ------------------------------------------------ |
| with_user_count? | boolean | include number of users subscribed to each event |


## Create Guild Scheduled Event % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/scheduled-events

Create a guild scheduled event in the guild. Returns a [guild scheduled event](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object) object on success.

> info
> A guild can have a maximum of 100 events with `SCHEDULED` or `ACTIVE` status at any time.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field                  | Type                                                                                                                        | Description                                                                                |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| channel_id? *          | snowflake *                                                                                                                 | the channel id of the scheduled event.                                                     |
| entity_metadata? **    | [entity metadata](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-entity-metadata) | the entity metadata of the scheduled event                                                 |
| name                   | string                                                                                                                      | the name of the scheduled event                                                            |
| privacy_level          | [privacy level](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-privacy-level)     | the privacy level of the scheduled event                                                   |
| scheduled_start_time   | ISO8601 timestamp                                                                                                           | the time to schedule the scheduled event                                                   |
| scheduled_end_time? ** | ISO8601 timestamp                                                                                                           | the time when the scheduled event is scheduled to end                                      |
| description?           | string                                                                                                                      | the description of the scheduled event                                                     |
| entity_type            | [entity type](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-entity-types)        | the entity type of the scheduled event                                                     |
| image?                 | [image data](#DOCS_REFERENCE/image-data)                                                                                    | the cover image of the scheduled event                                                     |

\* Optional for events with `'entity_type': EXTERNAL`

\*\* Required for events with `'entity_type': EXTERNAL`


## Get Guild Scheduled Event % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/scheduled-events/{guild_scheduled_event.id#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object}

Get a guild scheduled event. Returns a [guild scheduled event](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object) object on success.

###### Query String Params

| Field            | Type    | Description                                      |
| ---------------- | ------- | ------------------------------------------------ |
| with_user_count? | boolean | include number of users subscribed to this event |


## Modify Guild Scheduled Event % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/scheduled-events/{guild_scheduled_event.id#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object}

Modify a guild scheduled event. Returns the modified [guild scheduled event](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object) object on success.

> info
> To start or end an event, use this endpoint to modify the event's [status](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-status) field.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

> info
> This endpoint silently discards `entity_metadata` for non-`EXTERNAL` events.

###### JSON Params

| Field                 | Type                                                                                                                         | Description                                                                                |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| channel_id? *         | ?snowflake                                                                                                                   | the channel id of the scheduled event, set to `null` if changing entity type to `EXTERNAL` |
| entity_metadata?      | ?[entity metadata](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-entity-metadata) | the entity metadata of the scheduled event                                                 |
| name?                 | string                                                                                                                       | the name of the scheduled event                                                            |
| privacy_level?        | [privacy level](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-privacy-level)      | the privacy level of the scheduled event                                                   |
| scheduled_start_time? | ISO8601 timestamp                                                                                                            | the time to schedule the scheduled event                                                   |
| scheduled_end_time? * | ISO8601 timestamp                                                                                                            | the time when the scheduled event is scheduled to end                                      |
| description?          | ?string                                                                                                                      | the description of the scheduled event                                                     |
| entity_type? *        | [event entity type](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-entity-types)   | the entity type of the scheduled event                                                     |
| status?               | [event status](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-status)              | the status of the scheduled event                                                          |
| image?                | [image data](#DOCS_REFERENCE/image-data)                                                                                     | the cover image of the scheduled event                                                     |

\* If updating `entity_type` to `EXTERNAL`:

- `channel_id` is required and [must be set to null](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-field-requirements-by-entity-type)
- `entity_metadata` with a `location` field must be provided
- `scheduled_end_time` must be provided


## Delete Guild Scheduled Event % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/scheduled-events/{guild_scheduled_event.id#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object}

Delete a guild scheduled event. Returns a `204` on success.


## Get Guild Scheduled Event Users % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/scheduled-events/{guild_scheduled_event.id#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object}/users

Get a list of guild scheduled event users subscribed to a guild scheduled event. Returns a list of [guild scheduled event user](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-user-object) objects on success. Guild member data, if it exists, is included if the `with_member` query parameter is set.

###### Query String Params

| Field        | Type      | Description                                                                    | Default |
| ------------ | -------   | ------------------------------------------------------------------------------ | ------- |
| limit?       | number    | number of users to return (up to maximum 100)                                  | 100     |
| with_member? | boolean   | include guild member data if it exists                                         | false   |
| before? *    | snowflake | consider only users before given user id                                       | null    |
| after? *     | snowflake | consider only users after given user id                                        | null    |

\* Provide a user id to `before` and `after` for pagination. Users will always be returned in ascending order by `user_id`. If both `before` and `after` are provided, only `before` is respected. Fetching users in-between `before` and `after` is not supported.



## Get Guild Template % GET /guilds/templates/{template.code#DOCS_RESOURCES_GUILD_TEMPLATE/guild-template-object}

Returns a [guild template](#DOCS_RESOURCES_GUILD_TEMPLATE/guild-template-object) object for the given code.


## Create Guild from Guild Template % POST /guilds/templates/{template.code#DOCS_RESOURCES_GUILD_TEMPLATE/guild-template-object}

Create a new guild based on a template. Returns a [guild](#DOCS_RESOURCES_GUILD/guild-object) object on success. Fires a [Guild Create](#DOCS_TOPICS_GATEWAY/guild-create) Gateway event.

> warn
> This endpoint can be used only by bots in less than 10 guilds.

###### JSON Params

| Field | Type                                     | Description                             |
|-------|------------------------------------------|-----------------------------------------|
| name  | string                                   | name of the guild (2-100 characters)    |
| icon? | [image data](#DOCS_REFERENCE/image-data) | base64 128x128 image for the guild icon |


## Get Guild Templates % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/templates

Returns an array of [guild template](#DOCS_RESOURCES_GUILD_TEMPLATE/guild-template-object) objects. Requires the `MANAGE_GUILD` permission.


## Create Guild Template % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/templates

Creates a template for the guild. Requires the `MANAGE_GUILD` permission. Returns the created [guild template](#DOCS_RESOURCES_GUILD_TEMPLATE/guild-template-object) object on success.

###### JSON Params

| Field        | Type    | Description                                     |
|--------------|---------|-------------------------------------------------|
| name         | string  | name of the template (1-100 characters)         |
| description? | ?string | description for the template (0-120 characters) |


## Sync Guild Template % PUT /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/templates/{template.code#DOCS_RESOURCES_GUILD_TEMPLATE/guild-template-object}

Syncs the template to the guild's current state. Requires the `MANAGE_GUILD` permission. Returns the [guild template](#DOCS_RESOURCES_GUILD_TEMPLATE/guild-template-object) object on success.


## Modify Guild Template % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/templates/{template.code#DOCS_RESOURCES_GUILD_TEMPLATE/guild-template-object}

Modifies the template's metadata. Requires the `MANAGE_GUILD` permission. Returns the [guild template](#DOCS_RESOURCES_GUILD_TEMPLATE/guild-template-object) object on success.

###### JSON Params

| Field        | Type    | Description                                     |
|--------------|---------|-------------------------------------------------|
| name?        | string  | name of the template (1-100 characters)         |
| description? | ?string | description for the template (0-120 characters) |


## Delete Guild Template % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/templates/{template.code#DOCS_RESOURCES_GUILD_TEMPLATE/guild-template-object}

Deletes the template. Requires the `MANAGE_GUILD` permission. Returns the deleted [guild template](#DOCS_RESOURCES_GUILD_TEMPLATE/guild-template-object) object on success.


## Get Invite % GET /invites/{invite.code#DOCS_RESOURCES_INVITE/invite-object}

Returns an [invite](#DOCS_RESOURCES_INVITE/invite-object) object for the given code.

###### Query String Params

| Field                     | Type      | Description                                                 |
| ------------------------- | --------- | ----------------------------------------------------------- |
| with_counts?              | boolean   | whether the invite should contain approximate member counts |
| with_expiration?          | boolean   | whether the invite should contain the expiration date       |
| guild_scheduled_event_id? | snowflake | the guild scheduled event to include with the invite        |


## Delete Invite % DELETE /invites/{invite.code#DOCS_RESOURCES_INVITE/invite-object}

Delete an invite. Requires the `MANAGE_CHANNELS` permission on the channel this invite belongs to, or `MANAGE_GUILD` to remove any invite across the guild. Returns an [invite](#DOCS_RESOURCES_INVITE/invite-object) object on success. Fires a [Invite Delete](#DOCS_TOPICS_GATEWAY/invite-delete) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.


## Create Stage Instance % POST /stage-instances

Creates a new Stage instance associated to a Stage channel. Returns that [Stage instance](#DOCS_RESOURCES_STAGE_INSTANCE/stage-instance-object-stage-instance-structure).

Requires the user to be a moderator of the Stage channel.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field                       | Type      | Description                                                                                                                        |
| --------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| channel_id                  | snowflake | The id of the Stage channel                                                                                                        |
| topic                       | string    | The topic of the Stage instance (1-120 characters)                                                                                 |
| privacy_level?              | integer   | The [privacy level](#DOCS_RESOURCES_STAGE_INSTANCE/stage-instance-object-privacy-level) of the Stage instance (default GUILD_ONLY) |
| send_start_notification? \* | boolean   | Notify @everyone that a Stage instance has started                                                                                 |

\* The stage moderator must have the `MENTION_EVERYONE` permission for this notification to be sent.


## Get Stage Instance % GET /stage-instances/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}

Gets the stage instance associated with the Stage channel, if it exists.


## Modify Stage Instance % PATCH /stage-instances/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}

Updates fields of an existing Stage instance. Returns the updated [Stage instance](#DOCS_RESOURCES_STAGE_INSTANCE/stage-instance-object-stage-instance-structure).

Requires the user to be a moderator of the Stage channel.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field          | Type    | Description                                                                                                   |
| -------------- | ------- | ------------------------------------------------------------------------------------------------------------- |
| topic?         | string  | The topic of the Stage instance (1-120 characters)                                                            |
| privacy_level? | integer | The [privacy level](#DOCS_RESOURCES_STAGE_INSTANCE/stage-instance-object-privacy-level) of the Stage instance |


## Delete Stage Instance % DELETE /stage-instances/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}

Deletes the Stage instance. Returns `204 No Content`.

Requires the user to be a moderator of the Stage channel.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.


## Get Sticker % GET /stickers/{sticker.id#DOCS_RESOURCES_STICKER/sticker-object}

Returns a [sticker](#DOCS_RESOURCES_STICKER/sticker-object) object for the given sticker ID.


## List Nitro Sticker Packs % GET /sticker-packs

Returns the list of sticker packs available to Nitro subscribers.

###### Response Structure

| Field         | Type                                                                         |
| ------------- | ---------------------------------------------------------------------------- |
| sticker_packs | array of [sticker pack](#DOCS_RESOURCES_STICKER/sticker-pack-object) objects |


## List Guild Stickers % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/stickers

Returns an array of [sticker](#DOCS_RESOURCES_STICKER/sticker-object) objects for the given guild. Includes `user` fields if the bot has the `MANAGE_EMOJIS_AND_STICKERS` permission.


## Get Guild Sticker % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/stickers/{sticker.id#DOCS_RESOURCES_STICKER/sticker-object}

Returns a [sticker](#DOCS_RESOURCES_STICKER/sticker-object) object for the given guild and sticker IDs. Includes the `user` field if the bot has the `MANAGE_EMOJIS_AND_STICKERS` permission.


## Create Guild Sticker % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/stickers

Create a new sticker for the guild. Send a `multipart/form-data` body. Requires the `MANAGE_EMOJIS_AND_STICKERS` permission. Returns the new [sticker](#DOCS_RESOURCES_STICKER/sticker-object) object on success.

Every guilds has five free sticker slots by default, and each Boost level will grant access to more slots.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

> warn
> Lottie stickers can only be uploaded on guilds that have either the `VERIFIED` and/or the `PARTNERED` [guild feature](#DOCS_RESOURCES_GUILD/guild-object-guild-features). 

###### Form Params

| Field       | Type          | Description                                                                                  |
| ----------- | ------------- | -------------------------------------------------------------------------------------------- |
| name        | string        | name of the sticker (2-30 characters)                                                        |
| description | string        | description of the sticker (empty or 2-100 characters)                                       |
| tags        | string        | autocomplete/suggestion tags for the sticker (max 200 characters)                            |
| file        | file contents | the sticker file to upload, must be a PNG, APNG, or Lottie JSON file, max 500 KB             |


## Modify Guild Sticker % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/stickers/{sticker.id#DOCS_RESOURCES_STICKER/sticker-object}

Modify the given sticker. Requires the `MANAGE_EMOJIS_AND_STICKERS` permission. Returns the updated [sticker](#DOCS_RESOURCES_STICKER/sticker-object) object on success.

> info
> All parameters to this endpoint are optional.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field       | Type    | Description                                                                                  |
| ----------- | ------- | -------------------------------------------------------------------------------------------- |
| name        | string  | name of the sticker (2-30 characters)                                                        |
| description | ?string | description of the sticker (2-100 characters)                                                |
| tags        | string  | autocomplete/suggestion tags for the sticker (max 200 characters)                            |


## Delete Guild Sticker % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/stickers/{sticker.id#DOCS_RESOURCES_STICKER/sticker-object}

Delete the given sticker. Requires the `MANAGE_EMOJIS_AND_STICKERS` permission. Returns `204 No Content` on success.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.


## Get Current User % GET /users/@me

Returns the [user](#DOCS_RESOURCES_USER/user-object) object of the requester's account. For OAuth2, this requires the `identify` scope, which will return the object _without_ an email, and optionally the `email` scope, which returns the object _with_ an email.


## Get User % GET /users/{user.id#DOCS_RESOURCES_USER/user-object}

Returns a [user](#DOCS_RESOURCES_USER/user-object) object for a given user ID.


## Modify Current User % PATCH /users/@me

Modify the requester's user account settings. Returns a [user](#DOCS_RESOURCES_USER/user-object) object on success.

> info
> All parameters to this endpoint are optional.

###### JSON Params

| Field    | Type                                      | Description                                                                      |
| -------- | ----------------------------------------- | -------------------------------------------------------------------------------- |
| username | string                                    | user's username, if changed may cause the user's discriminator to be randomized. |
| avatar   | ?[image data](#DOCS_REFERENCE/image-data) | if passed, modifies the user's avatar                                            |


## Get Current User Guilds % GET /users/@me/guilds

Returns a list of partial [guild](#DOCS_RESOURCES_GUILD/guild-object) objects the current user is a member of. Requires the `guilds` OAuth2 scope.

###### Example Partial Guild

```json
{
  "id": "80351110224678912",
  "name": "1337 Krew",
  "icon": "8342729096ea3675442027381ff50dfe",
  "owner": true,
  "permissions": "36953089",
  "features": ["COMMUNITY", "NEWS"]
}
```

> info
> This endpoint returns 200 guilds by default, which is the maximum number of guilds a non-bot user can join. Therefore, pagination is **not needed** for integrations that need to get a list of the users' guilds.

###### Query String Params

| Field  | Type      | Description                            | Required | Default |
| ------ | --------- | -------------------------------------- | -------- | ------- |
| before | snowflake | get guilds before this guild ID        | false    | absent  |
| after  | snowflake | get guilds after this guild ID         | false    | absent  |
| limit  | integer   | max number of guilds to return (1-200) | false    | 200     |


## Get Current User Guild Member % GET /users/@me/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/member

Returns a [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) object for the current user. Requires the `guilds.members.read` OAuth2 scope.


## Leave Guild % DELETE /users/@me/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}

Leave a guild. Returns a 204 empty response on success.


## Create DM % POST /users/@me/channels

Create a new DM channel with a user. Returns a [DM channel](#DOCS_RESOURCES_CHANNEL/channel-object) object.

> warn
> You should not use this endpoint to DM everyone in a server about something. DMs should generally be initiated by a user action. If you open a significant amount of DMs too quickly, your bot may be rate limited or blocked from opening new ones.

###### JSON Params

| Field        | Type      | Description                             |
| ------------ | --------- | --------------------------------------- |
| recipient_id | snowflake | the recipient to open a DM channel with |


## Create Group DM % POST /users/@me/channels

Create a new group DM channel with multiple users. Returns a [DM channel](#DOCS_RESOURCES_CHANNEL/channel-object) object. This endpoint was intended to be used with the now-deprecated GameBridge SDK. DMs created with this endpoint will not be shown in the Discord client

> warn
> This endpoint is limited to 10 active group DMs.

###### JSON Params

| Field         | Type             | Description                                                            |
| ------------- | ---------------- | ---------------------------------------------------------------------- |
| access_tokens | array of strings | access tokens of users that have granted your app the `gdm.join` scope |
| nicks         | dict             | a dictionary of user ids to their respective nicknames                 |


## Get User Connections % GET /users/@me/connections

Returns a list of [connection](#DOCS_RESOURCES_USER/connection-object) objects. Requires the `connections` OAuth2 scope.


## List Voice Regions % GET /voice/regions

Returns an array of [voice region](#DOCS_RESOURCES_VOICE/voice-region-object) objects that can be used when setting a voice or stage channel's [`rtc_region`](#DOCS_RESOURCES_CHANNEL/channel-object-channel-structure).


## Create Webhook % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/webhooks

Creates a new webhook and returns a [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) object on success. Requires the `MANAGE_WEBHOOKS` permission.

An error will be returned if a webhook name (`name`) is not valid. A webhook name is valid if:
- It does not contain the substring '**clyde**' (case-insensitive)
- It follows the nickname guidelines in the [Usernames and Nicknames](#DOCS_RESOURCES_USER/usernames-and-nicknames) documentation, with an exception that webhook names can be up to 80 characters

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field   | Type                                      | Description                           |
| ------- | ----------------------------------------- | ------------------------------------- |
| name    | string                                    | name of the webhook (1-80 characters) |
| avatar? | ?[image data](#DOCS_REFERENCE/image-data) | image for the default webhook avatar  |


## Get Channel Webhooks % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/webhooks

Returns a list of channel [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) objects. Requires the `MANAGE_WEBHOOKS` permission.


## Get Guild Webhooks % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/webhooks

Returns a list of guild [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) objects. Requires the `MANAGE_WEBHOOKS` permission.


## Get Webhook % GET /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}

Returns the new [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) object for the given id.


## Get Webhook with Token % GET /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}

Same as above, except this call does not require authentication and returns no user in the webhook object.


## Modify Webhook % PATCH /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}

Modify a webhook. Requires the `MANAGE_WEBHOOKS` permission. Returns the updated [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) object on success.

> info
> All parameters to this endpoint are optional

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field      | Type                                      | Description                                        |
| ---------- | ----------------------------------------- | -------------------------------------------------- |
| name       | string                                    | the default name of the webhook                    |
| avatar     | ?[image data](#DOCS_REFERENCE/image-data) | image for the default webhook avatar               |
| channel_id | snowflake                                 | the new channel id this webhook should be moved to |


## Modify Webhook with Token % PATCH /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}

Same as above, except this call does not require authentication, does not accept a `channel_id` parameter in the body, and does not return a user in the webhook object.


## Delete Webhook % DELETE /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}

Delete a webhook permanently. Requires the `MANAGE_WEBHOOKS` permission. Returns a `204 No Content` response on success.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.


## Delete Webhook with Token % DELETE /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}

Same as above, except this call does not require authentication.


## Execute Webhook % POST /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}

Refer to [Uploading Files](#DOCS_REFERENCE/uploading-files) for details on attachments and `multipart/form-data` requests. Returns a message or `204 No Content` depending on the `wait` query parameter.

> info
> Note that when sending a message, you must provide a value for at **least one of** `content`, `embeds`, or `file`.

> info
> If the webhook channel is a forum channel, you must provide either `thread_id` in the query string params, or `thread_name` in the JSON/form params. If `thread_id` is provided, the message will send in that thread. If `thread_name` is provided, a thread with that name will be created in the forum channel.

###### Query String Params

| Field | Type    | Description                                                                                                                                                                                  | Required |
| ----- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| wait  | boolean | waits for server confirmation of message send before response, and returns the created message body (defaults to `false`; when `false` a message that is not saved does not return an error) | false    |
| thread_id | snowflake | Send a message to the specified thread within a webhook's channel. The thread will automatically be unarchived. | false    |

###### JSON/Form Params

| Field            | Type                                                                                 | Description                                                                                                                                                                 | Required                     |
| ---------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| content          | string                                                                               | the message contents (up to 2000 characters)                                                                                                                                | one of content, file, embeds |
| username         | string                                                                               | override the default username of the webhook                                                                                                                                | false                        |
| avatar_url       | string                                                                               | override the default avatar of the webhook                                                                                                                                  | false                        |
| tts              | boolean                                                                              | true if this is a TTS message                                                                                                                                               | false                        |
| embeds           | array of up to 10 [embed](#DOCS_RESOURCES_CHANNEL/embed-object) objects              | embedded `rich` content                                                                                                                                                     | one of content, file, embeds |
| allowed_mentions | [allowed mention object](#DOCS_RESOURCES_CHANNEL/allowed-mentions-object)            | allowed mentions for the message                                                                                                                                            | false                        |
| components \*    | array of [message component](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/component-object) | the components to include with the message                                                                                                                                  | false                        |
| files[n] \*\*    | file contents                                                                        | the contents of the file being sent                                                                                                                                         | one of content, file, embeds |
| payload_json \*\*| string                                                                               | JSON encoded body of non-file params                                                                                                                                        | `multipart/form-data` only   |
| attachments \*\* | array of partial [attachment](#DOCS_RESOURCES_CHANNEL/attachment-object) objects     | attachment objects with filename and description                                                                                                                            | false                        |
| flags            | integer                                                                              | [message flags](#DOCS_RESOURCES_CHANNEL/message-object-message-flags) combined as a [bitfield](https://en.wikipedia.org/wiki/Bit_field) (only `SUPPRESS_EMBEDS` can be set) | false                        |
| thread_name            | string                                                                              | name of thread to create (requires the webhook channel to be a forum channel) | false                        |

\* Requires an application-owned webhook.

\*\* See [Uploading Files](#DOCS_REFERENCE/uploading-files) for details.

> info
> For the webhook embed objects, you can set every field except `type` (it will be `rich` regardless of if you try to set it), `provider`, `video`, and any `height`, `width`, or `proxy_url` values for images.


## Execute Slack-Compatible Webhook % POST /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}/slack

Refer to [Slack's documentation](https://api.slack.com/incoming-webhooks) for more information. We do not support Slack's `channel`, `icon_emoji`, `mrkdwn`, or `mrkdwn_in` properties.

###### Query String Params

| Field     | Type      | Description                                                                                                                                           | Required |
| --------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| thread_id | snowflake | id of the thread to send the message in                                                                                                               | false    |
| wait      | boolean   | waits for server confirmation of message send before response (defaults to `true`; when `false` a message that is not saved does not return an error) | false    |


## Execute GitHub-Compatible Webhook % POST /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}/github

Add a new webhook to your GitHub repo (in the repo's settings), and use this endpoint as the "Payload URL." You can choose what events your Discord channel receives by choosing the "Let me select individual events" option and selecting individual events for the new webhook you're configuring.

###### Query String Params

| Field     | Type      | Description                                                                                                                                           | Required |
| --------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| thread_id | snowflake | id of the thread to send the message in                                                                                                               | false    |
| wait      | boolean   | waits for server confirmation of message send before response (defaults to `true`; when `false` a message that is not saved does not return an error) | false    |


## Get Webhook Message % GET /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Returns a previously-sent webhook message from the same token. Returns a [message](#DOCS_RESOURCES_CHANNEL/message-object) object on success.

###### Query String Params

| Field     | Type      | Description                        | Required |
| --------- | --------- | ---------------------------------- | -------- |
| thread_id | snowflake | id of the thread the message is in | false    |


## Edit Webhook Message % PATCH /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Edits a previously-sent webhook message from the same token. Returns a [message](#DOCS_RESOURCES_CHANNEL/message-object) object on success.

When the `content` field is edited, the `mentions` array in the message object will be reconstructed from scratch based on the new content. The `allowed_mentions` field of the edit request controls how this happens. If there is no explicit `allowed_mentions` in the edit request, the content will be parsed with _default_ allowances, that is, without regard to whether or not an `allowed_mentions` was present in the request that originally created the message.

Refer to [Uploading Files](#DOCS_REFERENCE/uploading-files) for details on attachments and `multipart/form-data` requests.
Any provided files will be **appended** to the message. To remove or replace files you will have to supply the `attachments` field which specifies the files to retain on the message after edit.

> warn
> Starting with API v10, the `attachments` array must contain all attachments that should be present after edit, including **retained and new** attachments provided in the request body.

> info
> All parameters to this endpoint are optional and nullable.

###### Query String Params

| Field     | Type      | Description                        | Required |
| --------- | --------- | ---------------------------------- | -------- |
| thread_id | snowflake | id of the thread the message is in | false    |

###### JSON/Form Params

| Field            | Type                                                                                 | Description                                                     |
| ---------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| content          | string                                                                               | the message contents (up to 2000 characters)                    |
| embeds           | array of up to 10 [embed](#DOCS_RESOURCES_CHANNEL/embed-object) objects              | embedded `rich` content                                         |
| allowed_mentions | [allowed mention object](#DOCS_RESOURCES_CHANNEL/allowed-mentions-object)            | allowed mentions for the message                                |
| components \*    | array of [message component](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/component-object) | the components to include with the message                      |
| files[n] \*\*    | file contents                                                                        | the contents of the file being sent/edited                      |
| payload_json \*\*| string                                                                               | JSON encoded body of non-file params (multipart/form-data only) |
| attachments \*\* | array of partial [attachment](#DOCS_RESOURCES_CHANNEL/attachment-object) objects     | attached files to keep and possible descriptions for new files  |

\* Requires an application-owned webhook.

\*\* See [Uploading Files](#DOCS_REFERENCE/uploading-files) for details.


## Delete Webhook Message % DELETE /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Deletes a message that was created by the webhook. Returns a `204 No Content` response on success.

###### Query String Params

| Field     | Type      | Description                        | Required |
| --------- | --------- | ---------------------------------- | -------- |
| thread_id | snowflake | id of the thread the message is in | false    |


## Get Gateway % GET /gateway

> info
> This endpoint does not require authentication.

Returns an object with a single valid WSS URL, which the client can use for [Connecting](#DOCS_TOPICS_GATEWAY/connecting). Clients **should** cache this value and only call this endpoint to retrieve a new URL if they are unable to properly establish a connection using the cached version of the URL.

###### Example Response

```json
{
  "url": "wss://gateway.discord.gg/"
}
```


## Get Gateway Bot % GET /gateway/bot

> warn
> This endpoint requires authentication using a valid bot token.

Returns an object based on the information in [Get Gateway](#DOCS_TOPICS_GATEWAY/get-gateway), plus additional metadata that can help during the operation of large or [sharded](#DOCS_TOPICS_GATEWAY/sharding) bots. Unlike the [Get Gateway](#DOCS_TOPICS_GATEWAY/get-gateway), this route should not be cached for extended periods of time as the value is not guaranteed to be the same per-call, and changes as the bot joins/leaves guilds.

###### JSON Response

| Field               | Type                                                                          | Description                                                                              |
| ------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| url                 | string                                                                        | The WSS URL that can be used for connecting to the gateway                               |
| shards              | integer                                                                       | The recommended number of [shards](#DOCS_TOPICS_GATEWAY/sharding) to use when connecting |
| session_start_limit | [session_start_limit](#DOCS_TOPICS_GATEWAY/session-start-limit-object) object | Information on the current session start limit                                           |

###### Example Response

```json
{
  "url": "wss://gateway.discord.gg/",
  "shards": 9,
  "session_start_limit": {
    "total": 1000,
    "remaining": 999,
    "reset_after": 14400000,
    "max_concurrency": 1
  }
}
```


## Get Current Bot Application Information % GET /oauth2/applications/@me

Returns the bot's [application](#DOCS_RESOURCES_APPLICATION/application-object) object.


## Get Current Authorization Information % GET /oauth2/@me

Returns info about the current authorization. Requires authentication with a bearer token.

###### Response Structure

| Field       | Type                                                                         | Description                                                                       |
| ----------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| application | partial [application](#DOCS_RESOURCES_APPLICATION/application-object) object | the current application                                                           |
| scopes      | array of strings                                                             | the scopes the user has authorized the application for                            |
| expires     | ISO8601 timestamp                                                            | when the access token expires                                                     |
| user?       | [user](#DOCS_RESOURCES_USER/user-object) object                              | the user who has authorized, if the user has authorized with the `identify` scope |

###### Example Authorization Information

```json
{
    "application": {
        "id": "159799960412356608",
        "name": "AIRHORN SOLUTIONS",
        "icon": "f03590d3eb764081d154a66340ea7d6d",
        "description": "",
        "hook": true,
        "bot_public": true,
        "bot_require_code_grant": false,
        "verify_key": "c8cde6a3c8c6e49d86af3191287b3ce255872be1fff6dc285bdb420c06a2c3c8"
    },
    "scopes": [
        "guilds.join",
        "identify"
    ],
    "expires": "2021-01-23T02:33:17.017000+00:00",
    "user": {
        "id": "268473310986240001",
        "username": "Discord",
        "avatar": "f749bb0cbeeb26ef21eca719337d20f1",
        "discriminator": "0001",
        "public_flags": 131072
    }
}
```
