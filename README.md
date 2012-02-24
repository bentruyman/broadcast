# Broadcast

## Installation

Install the node module dependencies by running the following from the root of
the project:

    npm install

Install `up` globally to run the app:

    npm install up -g

Run the database installation script from the root of the project:

    ./bin/install

## Running

    $ up app

That's it!

For public channel set listing: [http://localhost:3000/](http://localhost:3000/)

For administration: [http://localhost:3000/admin](http://localhost:3000/admin)

(assuming you're using the default configuration)

## Domain Objects

A Broadcast application consists of three main domain objects: Channels,
Configured channels and Channel sets.

    Channel:
      index: Number # the channel's number
      name: String # name of the channel
      description: String # description of the channel
      url: String # url of the channel's asset
      assetType: String # image, video, page (default)
      timeout: Number # the amount of time a channel should stay on screen (default, 30 seconds)
    
    ChannelSet:
      name: String # name of the channel set
      description: String # description of the channel set
      channels: [ConfiguredChannel] # list of configured channels
    
    Display:
      name: String # name of the display
      description: String # description of the display
      channels: [ConfiguredChannel] # list of configured channels

## License

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>
