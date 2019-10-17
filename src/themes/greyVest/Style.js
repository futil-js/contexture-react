import React from 'react'

/*
Styles for the Grey Vest theme. These are ~external~ to the Grey Vest library,
and are meant for styling generic contexture-react components according to the
theme.
*/
export default () => (
  <style>
    {`
      /* Tags Popover */

      .tags-input-popover {
        /* counteract default popover padding */
        margin: -5px;
      }
      .tags-input-popover > div {
        border-bottom: solid 1px rgba(216, 216, 216, 0.3);
        padding: 15px;
      }
      .line-separator {
        background: rgba(216, 216, 216, 0.3);
        height: 1px;
        margin-top: 15px;
        margin-bottom: 15px;
      }
      .tags-popover {
        padding: 15px;
        width: 250px;
        font-size: 15px;
      }
      .tags-popover button {
        width: 100%;
      }
      .tags-input-popover .popover-item:first-child,
      .tags-popover .popover-item {
        padding-top: 0;
      }
      .tags-input-popover .popover-item,
      .tags-popover .popover-item {
        padding-top: 10px;
      }
  
      /* ResultPager */

      .contexture-result-pager {
        display: flex;
        align-items: center;
        position: relative;
        top: 50px;
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 0 2px 10px 0 rgba(39, 44, 65, 0.1);
        padding: 15px;
      }


      /* Facet */

      .contexture-facet a {
        color: #0076de
      }
      .contexture-facet {
        font-size: 14px;
      }
      .contexture-facet > label {
        margin: 5px 0;
      }
      .contexture-facet .gv-checkbox {
        margin: 0 10px 0 0;
      }
      .contexture-facet > .gv-input[type="text"] {
        margin-bottom: 10px;
      }
      .contexture-facet-cardinality {
        margin: 10px 0;
      }
      .contexture-facet > label > div {
        overflow: hidden;
        text-overflow: ellipsis;
      }


      /* Number ExampleType */

      .contexture-number-separator {
        margin: 0 10px;
      }
      .contexture-number-best-range {
        margin-top: 15px;
      }


      /* Filter List */

      .filter-list.gv-box {
        padding: 30px;
      }
      .filter-list-item {
        border-bottom: solid 1px rgba(216, 216, 216, 0.3);
        padding-bottom: 30px;
        margin-bottom: 30px;
        margin-left: -30px;
        margin-right: -30px;
        padding-left: 30px;
        padding-right: 30px;
      }
      .filter-field-label {
        font-size: 16px;
        font-weight: bold;
        word-break: break-all;
      }
      .filter-field-label-icon {
        color: #9b9b9b;
      }
      .filter-field-has-value {
        color: #0076de;
      }
      .filter-field-icon-refresh .gv-text-button {
        color: #0076de;
      }
      .filter-field-icon-refresh .gv-text-button:hover {
        color: #f6f6f6;
        background-color: #0076de;
      }
      .filter-list-item-contents {
        margin-top: 15px;
      }
      .filter-list-group {
        border-left: solid 2px;
        padding-left: 35px; /* 30 for filter-list-item + 5 space */
        margin-left: -30px;
        margin-top: -25px; /* -30 for filter-list-item + 5 space */
        padding-top: 30px;
      }
      .filter-actions-popover {
        userSelect: none;
        marginTop: 0.5rem;
        min-width: 5rem;
        transform: translateX(-2.25rem);
        lineHeight: 1.4rem;
      }
      .filter-actions-selected-type {
        opacity: 0.7;
        color: initial !important;
        cursor: default !important;
      }
      .filter-actions-separator {
        border-bottom: 1px solid #eee;
        margin: 4px -5px;
      }


      /* Filter Button List */

      .filter-button-list.nested {
        border: 2px solid;
        border-radius: 6px;
        padding: 3px 5px;
        margin: 2px 5px;
      }
      .filter-button-list .check-button {
        margin: 5px;
        white-space: nowrap;
      }
      .filter-button-list > *:first-child {
        margin-left: 0;
      }
      .filter-button-list > *:last-child {
        margin-right: 0;
      }
      .filter-button-modal {
        min-width: 300px;
      }
      .filter-button-modal * {
        max-width: 480px;
      }
      .filter-button-modal h1 {
        margin: 0;
      }
      .filter-button-modal .filter-description {
        margin: 20px 0;
        color: #4a4a4a;
        line-height: 1.5;
      }
      .filter-button-modal .filter-component {
        margin: 30px 0;
      }
      .filter-button-modal .gv-button {
        margin-right: 10px;
      }


      /* Steps Accordion */

      .steps-accordion .accordion-step {
        padding: 40px;
        border-bottom: 1px solid #eef0f1;
      }
      .steps-accordion .gv-button {
        margin-right: 10px;
        margin-top: 5px;
        margin-bottom: 5px;
      }
      .steps-accordion .step-contents {
        margin: 30px 0;
      }
      .steps-accordion .accordion-step-title > * {
        margin: 0;
      }
      .steps-accordion .accordion-step-title span.step-number {
        color: #0076de;
      }
      .steps-accordion .back-button i {
        vertical-align: middle;
        line-height: 14px;
        margin: 0 10px 0 -5px;
        opacity: 0.4;
      }
      .steps-accordion .gv-button:first-child {
        margin-left: 0;
        margin-top: 5px;
        margin-bottom: 5px;
      }

      /* Search Layout ?? */
      .search-layout-builder .down-arrow-shape {
        display: inline-block;
        position: relative;
        background: white;
        padding: 0;
        width: 30px;
        text-align: center;
        height: 0;
        top: -7px;
        z-index: 1;
      }
      .search-layout-builder .down-arrow-shape i {
        top: -3px;
        color: #cccccc;
      }
      .search-layout-builder .down-arrow-shape:after {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        top: 100%;
        width: 0;
        height: 0;
        border-top: 17px solid white;
        border-right: 25px solid transparent;
        border-bottom: 0px solid transparent;
        border-left: 11px solid transparent;
      }
      .search-layout-basic .down-arrow-shape {
        display: inline-block;
        position: relative;
        background: white;
        padding: 0;
        text-align: center;
        height: 10px;
        top: -5px;
      }
      .search-layout-basic .down-arrow-shape i {
        top: -4px;
        color: #cccccc;
      }
      .search-bar .down-arrow-shape i {
        top: auto;
        color: inherit;
      }
      .down-arrow-shape-container {
        height: 1px;
        cursor: pointer;
        text-align: center;
      }
      .search-bar .down-arrow-shape {
        display: inline-block;
        position: relative;
        background: white;
        padding: 0;
        width: 40px;
        text-align: center;
        height: 10px;
        top: auto;
      }
      .search-bar .down-arrow-shape:after {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        top: 100%;
        width: 0;
        height: 0;
        border-top: 20px solid white;
        border-right: 20px solid transparent;
        border-bottom: 0 solid transparent;
        border-left: 20px solid transparent;
      }
    `}
  </style>
)
