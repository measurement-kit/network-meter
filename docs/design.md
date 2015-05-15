Network Meter Design Document
========================
Status: early draft

Introduction
------------
Network Meter is an extensible graphical frontend for a number of network-based
tests.

Installation
------------
Network Meter SHOULD be distributed as a self-unpacking statically linked executable.
All files should be contained within a single folder - storing files in tempoarary
folders should be avoided - this allows for straight forward removal of any traces
of the tool by simply deleting the folder (a la Tor Browser.)

Configuration
-----------
Network Meter can be provided with plugin files. Plugin files may be bundled with 
the program or may be downloaded from other sources seperately. Plugins may 
then by loaded through the user interface.

On the first load of the plugin, Network Meter will determine what (if any) dependancies
need to be installed. It will then fetch and configure those via apt-get, github,
brew, etc. depending on the host platform. Network Meter will always prefer secure
download protocols.

Once the dependanices are met, Network Meter configures the test as specified in the
plugin and exposes it within the user interface. 

Inputs
------
Network Meter then will offer the user a to enter inputs for the test. The fields
presented to the user will be chosen by the plugin.

Processing
----------
When the user starts the test, the inputs are collected and forwarded to
the plugin. The appropirate commands are then executed. Optionally, the 
plugin may offer some kind of callback to provide the user with feedback
on the progression of the test.

Results
-------
Once the test in complete, the user is notified through the interface.
The test output is then parsed according to the instructions provided by plugin.
The user is then presented with a summary of the test findings. The format of the
report summary is to be determined by the plugin. The user may optionally examine
the full, verbose test logs.

Transmission
------------
A number of plugins may wish to report their findings back to a central
collector. This may be a security risk and particular care should be taken to
protect the user's anonymity.

The user will be informed of the plugin's intent to transmit data over the 
network. The user should be allowed to review all the report data before
it is sent. Most importantly, the user should be able to opt-out of data sharing
at any time if they so wish.

###Tor
Results may be sent over the Tor anonymity network for increased privacy and to 
reduce the likelyhood of retribution. Should a plugin be confirgured to use tor,
Network Meter will attempt to connect to the network after obtaining the user's consent.
Should a connection to the tor network be unavailable, the program may attempt
to fetch a bridge address and configure tor to use it.
