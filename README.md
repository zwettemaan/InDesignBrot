# Download

![screenshot_2023-05-04_at_8 41 22_am_360](https://user-images.githubusercontent.com/3396477/236360673-ed908a8e-4892-4a6e-a184-d77d6b739d45.png)

To install, download the latest version of InDesignBrot here:

https://github.com/zwettemaan/InDesignBrot/tree/main/build

Click the file name, then click the _Raw_ button.

Follow the instructions in the read me file.

Precalculated sample .indd files (need InDesign 2023 to open them):

![Pre-calculated 100x100 indd file](https://github.com/zwettemaan/InDesignBrot/raw/main/Sample_kNumSteps_100.indd.zip)

![Pre-calculated 150x150 indd file](https://github.com/zwettemaan/InDesignBrot/raw/main/Sample_kNumSteps_150.indd.zip)

![Pre-calculated 200x200 indd file](https://github.com/zwettemaan/InDesignBrot/raw/main/Sample_kNumSteps_200.indd.zip)

# InDesignBrot

This is the source structure for the InDesignBrot script. It was generated
using UXPScriptSparker:

https://github.com/zwettemaan/UXPScriptSparker

Run the `Mac/build.command` or `Windows/build.bat` scripts to build a
redistributable .zip file in the `build` folder.

Read the `ReadMe for InDesignBrot.md` for more info.

# License

This license covers the 'InDesignBrot' script.

Copyright (c) 2015-2023 by Rorohiko Ltd. All rights reserved.

You may make as many copies of this software and documentation as you wish; 
give exact copies of the original version to anyone; and distribute the
software and documentation in its unmodified form as provided on the 
Rorohiko web site via electronic means.

All copies must include an unmodified copy of this ReadMe file and 
sample files.

There is no charge for any of the above. 

You are, however, specifically prohibited from charging, or requesting
donations, for any such copies, however made; and from distributing 
the software and/or documentation with other products (commercial or 
otherwise) without prior written permission. 


# What it is

_InDesignBrot_ has no practical purpose - it's more of a 'fun' thing.

It visualizes the MandelBrot set in InDesign using small 
frames arranged in a huge grid.

_InDesignBrot_ is a sample of the scripts that can be created with 
_UXPScriptSparker_ - it is one of the options in the 'Starter Code' 
dropdown menu.

_UXPScriptSparker_ is a free and open source project to create 'starter' 
projects to get your feet wet with InDesign and UXPScript. 

https://github.com/zwettemaan/UXPScriptSparker

_InDesignBrot_ has a 'dual' nature - it can be run as an ExtendScript 
as well as a UXPScript.

# How to install InDesignBrot

Start InDesign 2023 or higher

Bring up the Scripts Panel (_Window - Utilities - Scripts_)

Right-click the 'User' folder on this panel, and select 
_Reveal in Finder_ or _Reveal in Explorer_

A folder should open in the Finder or Explorer. 

One more step: double click the _Scripts Panel_ folder icon
to get _into_ the _Scripts Panel_ folder. 

Once you have the _Scripts Panel_ folder open, drag the
whole _InDesignBrot_ folder into it.

Switch back to InDesign. _InDesignBrot_ should now appear on the 
Scripts Panel in InDesign.

You can now run the InDesignBrot script by either double-clicking
_run\_as\_ExtendScript.jsx_ or _run\_as\_UXPScript.idjs_ on the Scripts Panel.

These two 'wrappers' run the exact same script (_InDesignBrot.js_) as an 
ExtendScript or as a UXPScript. 

Note: in InDesign 18.2, running as UXPScript is many times slower 
than running as ExtendScript.

# How to tweak

_InDesignBrot_ is easy to tweak: open the `InDesignBrot.js` file in a
proper text editor program and adjust the `kNumPixels` to a higher or lower
value. 

Do not use a word processor program to do this (see further for more info).

Don't go overboard - start with small increases first (e.g. add 5 or 10
to the current value of `kNumPixels`).

Take note that the execution time increases dramatically with increasing
values of kNumPixels. E.g. a setting of `kNumPixels = 100` takes many 
minutes to execute in ExtendScript.

There is a sample .indd file provided in the download, which shows the 
result with `kNumPixels = 100`, to save you from calculating it yourself.

# Text Editors vs Word Processors

Word processors often damage scripts on open/save. For example, word
processors often try to 'improve' the script by changing quotes into
curly quotes, which breaks the script.

Do not open/save scripts with a word processor!

Sample text editors: NotePad, NotePad++, BBEdit, Visual Studio Code,
Sublime Text, Atom,... 

Sample word processors: MS Word, TextEdit (Mac), WordPad (Windows),... 

# Disclaimer

This software is provided as is without warranty of any kind, either 
expressed or implied, including, but not limited to the implied warranties
of software programs and fitness for a particular purpose. The entire 
risk as to the quality and performance of the program is with you. 
If you use the program, please do so with the understanding that you assume 
all risks of using it. 
 
# License

This license covers the 'InDesignBrot' script.

Copyright (c) 2015-2023 by Rorohiko Ltd. All rights reserved.

You may make as many copies of this software and documentation as you wish; 
give exact copies of the original version to anyone; and distribute the
software and documentation in its unmodified form as provided on the 
Rorohiko web site via electronic means.

All copies must include an unmodified copy of this ReadMe file and 
sample files.

There is no charge for any of the above. 

You are, however, specifically prohibited from charging, or requesting
donations, for any such copies, however made; and from distributing 
the software and/or documentation with other products (commercial or 
otherwise) without prior written permission. 


