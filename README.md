# todoist keyboard navigator

The Google Chrome extension to enable you to operate todoist.com with the keyboard.

## supported keyboard shortcuts

These keyboard shortcuts are inspired by the Gmail.

### ledt menu

|key|action|
|--|--|
|`g` + `i`|show "Inbox"|
|`g` + `t`|show "Today"|
|`g` + `w`|show "Next 7 days"|
|`g` + `p`|toggle show/hide the "Projects" list|
|`g` + `l`|toggle show/hide the "Labels" list|
|`g` + `f`|toggle show/hide the "Filters" list|
|`g` + `1`|show the 1st favorite item|
|`g` + `2`|show the 2nd favorite item|
|...|...|
|`g` + `9`|show the 9th favorite item|

### right area

|key|action|
|--|--|
|`*` + `a`|select all items|
|`*` + `n`|deselect all items|

## how it works

The extension emulates the click and mousedown event via JavaScript. So if the todoist.com changes the page layout, then it may not work.