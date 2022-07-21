import React from 'react';
import dispatcher from './../helpers/dispatcher';

import CopyToClipboard from './CopyToClipboard';
import { toType } from './../helpers/util';

//icons
import { RemoveCircle as Remove, AddCircle as Add, Filter, IconPlaceHolder } from "./icons";

//theme
import Theme from './../themes/getStyle';

export default class extends React.PureComponent {
    getObjectSize = () => {
        const { size, theme, displayObjectSize } = this.props;
        if (displayObjectSize) {
            return (
                <span class="object-size" {...Theme(theme, 'object-size')}>
                    {size} item{size === 1 ? '' : 's'}
                </span>
            );
        }
    };

    getFilterAttribute = rowHovered => {
        let { theme, namespace, name, src, rjvId, depth } = this.props;

        return (
          <span
            class="click-to-add"
            style={{
                verticalAlign: 'top',
                display: rowHovered ? 'inline-block' : 'none'
            }}
          >
             <Filter class={"click-to-add"}
                     {...Theme(theme, 'addVarIcon')}
               onClick={() =>{
                 const request = {
                   name: depth > 0 ? name : null,
                   namespace: namespace.splice(
                     0,
                     namespace.length - 1
                   ),
                   existing_value: src,
                   variable_removed: false,
                   key_name: null
                 };

                 dispatcher.dispatch({
                   name: 'VARIABLE_ADD_FILTER',
                   rjvId: rjvId,
                   data: request
                 });
               }}
             >
             </Filter>

          </span>
        )
    }

    getAddAttribute = rowHovered => {
        const { theme, namespace, name, src, rjvId, depth } = this.props;

        return (
            <span
                class="click-to-add"
                style={{
                    verticalAlign: 'top',
                    display: rowHovered ? 'inline-block' : 'none'
                }}
            >
                <Add
                    class="click-to-add-icon"
                    {...Theme(theme, 'addVarIcon')}
                    onClick={() => {
                        const request = {
                            name: depth > 0 ? name : null,
                            namespace: namespace.splice(
                                0,
                                namespace.length - 1
                            ),
                            existing_value: src,
                            variable_removed: false,
                            key_name: null
                        };
                        if (toType(src) === 'object') {
                            dispatcher.dispatch({
                                name: 'ADD_VARIABLE_KEY_REQUEST',
                                rjvId: rjvId,
                                data: request
                            });
                        } else {
                            dispatcher.dispatch({
                                name: 'VARIABLE_ADDED',
                                rjvId: rjvId,
                                data: {
                                    ...request,
                                    new_value: [...src, null]
                                }
                            });
                        }
                    }}
                />
            </span>
        );
    };

    getRemoveObject = rowHovered => {
        const { theme, hover, namespace, name, src, rjvId } = this.props;

        //don't allow deleting of root node
        if (namespace.length === 1) {
            return;
        }
        return (
            <span
                class="click-to-remove"
                style={{
                    display: rowHovered ? 'inline-block' : 'none'
                }}
            >
                <Remove
                    class="click-to-remove-icon"
                    {...Theme(theme, 'removeVarIcon')}
                    onClick={() => {
                        dispatcher.dispatch({
                            name: 'VARIABLE_REMOVED',
                            rjvId: rjvId,
                            data: {
                                name: name,
                                namespace: namespace.splice(
                                    0,
                                    namespace.length - 1
                                ),
                                existing_value: src,
                                variable_removed: true
                            }
                        });
                    }}
                />
            </span>
        );
    };

  getIconPlaceHolder = () =>{
    const { variable, theme } = this.props;

    return (
      <div
        class="icon-place-holder"
        style={{
          verticalAlign: 'top',
          display: this.state.hovered ? 'inline-block' : 'none'
        }}
      >
        <IconPlaceHolder
          class="click-to-edit-icon"
          {...Theme(theme, 'editVarIcon')}
        />
      </div>
    );
  }

  render = () => {
    const {
            theme,
            onDelete,
            onAdd,
            enableClipboard,
            src,
            namespace,
            rowHovered,
            onAddFilter
        } = this.props;
        return (
            <div
                {...Theme(theme, 'object-meta-data')}
                class="object-meta-data"
                onClick={e => {
                    e.stopPropagation();
                }}
            >
                {/* size badge display */}
                {this.getObjectSize()}
                {/* copy to clipboard icon */}
                {enableClipboard ? (
                    <CopyToClipboard
                        rowHovered={rowHovered}
                        clickCallback={enableClipboard}
                        {...{ src, theme, namespace }}
                    />
                ) : null}
                {/* copy add/remove icons */}
                {onAdd !== false ? this.getAddAttribute(rowHovered) : null}
                {onDelete !== false ? this.getRemoveObject(rowHovered) : null}
{/*
                {onAddFilter !== false ? this.getFilterAttribute(rowHovered) : null}
*/}
            </div>
        );
    };
}
