window.fileContents = `

@eq-color-base: #343240; // main background
@eq-color-dark: #312d3d; // Slightly lightened version of the base color
@eq-color-text: #c2c7e4;   // MAIN text

@eq-color-highlight:  #f2f4ff;   // highlighted & selected text
@eq-color-annotation: #0f0f0f; // Backgrounds in subtle highlights
@eq-color-input:      #533cdd;   // Input fields' highlights

@eq-color-info:     #63b4c4;   // inputs, something else?
@eq-color-success:  #74c38f;  // green / success
@eq-color-warning:  #dbc290;  // warning
@eq-color-modified: #ab80b3;  // modified
@eq-color-error:    #d04168;  // red / error
// @eq-color-5: #E5E9F0;   // DUNNOLOL
// @eq-color-7: #57e2e2;   // cyan ???
// @eq-color-9: #237bd2;   // blue / primary
// @eq-color-10: #5541f6;  // purple ICCCE
// @eq-color-15: #ee57d3;  // pink
 --varri: #eeeeee;
 @varri: #eaeaea;
@import "colors";
@ui-theme-name:   eq;
@transition-time: 483ms;
@transition-color:
  color @transition-time ease,
  border-color @transition-time ease,
  background-color @transition-time ease;

@text-color:            @eq-color-text;
@text-color-subtle:     mix(@eq-color-text, @eq-color-base, 50%);
@text-color-highlight:  @eq-color-highlight;
@text-color-selected:   lighten(@eq-color-highlight, 1%);
@text-color-ignored:    @text-color-subtle;

@text-color-info:       @eq-color-info;
@text-color-renamed:    @eq-color-info;
@text-color-success:    @eq-color-success;
@text-color-added:      @eq-color-success;
@text-color-warning:    @eq-color-warning;
@text-color-modified:   @eq-color-modified;
@text-color-error:      @eq-color-error;
@text-color-removed:    @eq-color-error;

@background-color-highlight:  @eq-color-annotation;
@background-color-selected:   @eq-color-dark;
@background-color-info:       @eq-color-info;
@background-color-success:    @eq-color-success;
@background-color-warning:    @eq-color-warning;
@background-color-error:      @eq-color-error;

@ui-site-color-1: @eq-color-info;
@ui-site-color-2: @eq-color-success;
@ui-site-color-3: @eq-color-warning;
@ui-site-color-4: @eq-color-error;
@ui-site-color-5: @eq-color-modified;

@progress-loading-bar-background-color: @eq-color-info;


@base-border-color:     @eq-color-dark;
@app-background-color:  @eq-color-base;
@base-background-color: @eq-color-base;

@button-background-color:           transparent;
@button-background-color-hover:     @input-border-color;
@button-background-color-selected:  @input-border-color;

@input-text-color-active:           @eq-color-base;
@input-background-color:            @eq-color-dark;
@input-background-color-active:     @eq-color-annotation;

@gutter-text-color:                 @text-color-subtle;
@gutter-text-color-selected:        @text-color-selected;
@gutter-background-color:           lighten(@eq-color-base, 1%);
@gutter-background-color-selected:  lighten(@eq-color-base, 2%);

@overlay-background-color:          @eq-color-base;
@pane-item-background-color:        @eq-color-base;
@tree-view-background-color:        @eq-color-base;
@tool-panel-background-color:       @eq-color-base;
@inset-panel-background-color:      @eq-color-dark;
@panel-heading-background-color:    @eq-color-dark;

@tab-bar-background-color:    @eq-color-base;
@tab-background-color:        lighten(@eq-color-dark, 2%);
@tab-background-color-hover:  lighten(@eq-color-dark, 4%);
@tab-background-color-active: lighten(@eq-color-dark, 0%);

@scrollbar-track-color:       transparent;
@scrollbar-color:             @eq-color-dark;
@scrollbar-color-active:      @eq-color-dark;

@input-border-color:          @eq-color-text;
@input-border-color-active:   @input-background-color-active;
@button-border-color:         @input-border-color;
@scrollbar-border-color:      @base-border-color;
@overlay-border-color:        @base-border-color;
@pane-item-border-color:      @base-border-color;
@inset-panel-border-color:    @base-border-color;
@tool-panel-border-color:     @base-border-color;
@panel-heading-border-color:  @base-border-color;
@tab-bar-border-color:        @base-border-color;
@tab-border-color:            @base-border-color;
@tree-view-border-color:      @base-border-color;

--ok: rgb(0,100, 300);
@rgbtest2: rgba(  025,100, 300,    0.8 );
@rgbtest2: rgba(  025114,100, 300,    0.8 );

@tooltip-text-color:          @eq-color-text;
@tooltip-background-color:    @eq-color-annotation;
@tooltip-key-text-color:      @eq-color-info;
@tooltip-key-background-color: @eq-color-annotation;


@use-custom-controls: true;

@font-family-base:
  "Gotham",
  "Montserrat",
  "Questrial",
  "Raleway",
  "Open sans",
  "BlinkMacSystemFont",
  "System Font",
  "Helvetica Neue",
  "Roboto",
  "Cantarell",
  "Ubuntu",
  "Lucida Grande",
  "Segoe UI",
  "Noto Sans",
  sans-serif;

@font-family:
  "Source Sans Pro",
  "Roboto Condensed",
  "Proxima Soft",
  @font-family-base;

@input-font-family:
  @font-family-base;


/*+--- build ---+*/
@build-terminal-background-color: darken(@eq-color-base, 2%);

/*+--- imdone-atom ---+*/
@imdone-atom-task-background-color: darken(@eq-color-dark, 2%);
@imdone-atom-task-background-color-draged: @eq-color-dark;

/*+--- indent-guide-improved ---+*/
@indent-guide-improved-base-color: @eq-color-annotation;
@indent-guide-improved-active-color: @eq-color-input;

/*+--- markdown-preview ---+*/
@markdown-preview-background-color: @eq-color-highlight;
@markdown-preview-border-color: @eq-color-text;
@markdown-preview-code-background-color: @eq-color-text;
@markdown-preview-table-body-color: @eq-color-annotation;
@markdown-preview-text-color: @eq-color-base;

/*+--- tool-bar ---+*/
@tool-bar-spacer-border-color: @eq-color-text;

@icon-size:               2em;
@disclosure-arrow-size:   0.8em;
@component-border-radius: 4px;
@component-padding:       1.5em;
@component-line-height:   2em;
@menu-letter-spacing:     3px;

@component-icon-padding:  0.35em;
@component-icon-size:     @icon-size;
@tab-icon-size:           @icon-size;
@list-active-icon-size:   @icon-size;

@font-size:               16px;
@input-font-size:         18px;
@tree-view-font-size:     0.85em;

@tab-height:              6.4em;
@tab-bottom-height:       0.8 * @tab-height;
@input-height:            2.4 * @input-font-size;
@list-item-height:        2em;
@list-head-height:        2 * @list-item-height;

@font-weight:             500;
@menu-font-weight:        400;
@input-font-weight:       200;
@editor-font-weight:      500;

@panel-nudge-radius:      2em;
@toggle-area-size:        20em;
@toggle-area-outset:      0em;
@shadow-spread:           3em;
@shadow-offset:           0.2em;
@shadow-opacity:          0.2;
`
