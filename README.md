# Download

![screenshot_2023-05-04_at_8 41 22_am_360](https://user-images.githubusercontent.com/3396477/236360673-ed908a8e-4892-4a6e-a184-d77d6b739d45.png)

![Installation links and instructions](https://coppieters.nz/?p=1008)

Switch to InDesign and bring up the Scripts panel.

Precalculated sample .indd files (need InDesign 2023 to open them):

![Pre-calculated 100x100 indd file](https://github.com/zwettemaan/InDesignBrot/raw/main/Sample_kNumSteps_100.indd.zip)

![Pre-calculated 150x150 indd file](https://github.com/zwettemaan/InDesignBrot/raw/main/Sample_kNumSteps_150.indd.zip)

![Pre-calculated 200x200 indd file](https://github.com/zwettemaan/InDesignBrot/raw/main/Sample_kNumSteps_200.indd.zip)

# InDesignBrot

This is the source structure for the InDesignBrot script.

# License

This license covers the 'InDesignBrot' script.

Copyright (c) 2015-2024 by Rorohiko Ltd. All rights reserved.

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

The `num pixels` setting determines the size of the grid (default: 19x19).

The `max steps` setting determines the accuracy of the calculation. For higher
grid sizes you want to increase max steps as well.

The runtime of the script is roughly proportional to the square of `num pixels`.

The runtime of the script is roughly proportional to `max steps`.

# How to install InDesignBrot

Start InDesign 2023 or higher

Bring up the Scripts Panel (_Window - Utilities - Scripts_)

Double-click the _InDesignBrot_idjs_ script on the InDesign Scripts panel.

# How to tweak

You can tweak the parameters for InDesignBrot by editing the info on the
pasteboard of the sample document.

Don't go overboard - start with small increases first (e.g. add 5 or 10
to the current value of `num pixels`).

Take note that the execution time increases dramatically with increasing
values of `num pixels`. E.g. a setting of `num pixels = 100` takes many 
minutes to execute in ExtendScript.

There are a few sample .indd file provided in the download, which shows the 
result with higher pixel values, to save you from calculating it yourself.

# Disclaimer

This software is provided as is without warranty of any kind, either 
expressed or implied, including, but not limited to the implied warranties
of software programs and fitness for a particular purpose. The entire 
risk as to the quality and performance of the program is with you. 
If you use the program, please do so with the understanding that you assume 
all risks of using it. 
 
# License

This license covers the 'InDesignBrot' script.

Copyright (c) 2015-2024 by Rorohiko Ltd. All rights reserved.

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


