import '../styles/App.css';

import React, { Component, Fragment } from "react";
import { findDOMNode } from "react-dom";
import { Anchor, Box, Button, Keyboard, Text } from "grommet";
import { FormDown, FormNext } from "grommet-icons";

const getExpandedItems = items =>
  items.reduce((expandedItems, item) => {
    const { children, expanded, id } = item;
    if (expanded) {
      expandedItems.push(id);
    }
    let childrenExpandedItems = [];
    if (children) {
      childrenExpandedItems = getExpandedItems(children);
    }
    return expandedItems.concat(childrenExpandedItems);
  }, []);

const getCollapsibleItems = items =>
  items.reduce((collapsibleItems, { children, id }) => {
    let childrenCollapsibleItems = [];
    if (children) {
      collapsibleItems.push(id);

      childrenCollapsibleItems = getCollapsibleItems(children);
    }
    return collapsibleItems.concat(childrenCollapsibleItems);
  }, []);

const getFlatChildrenIds = items =>
  items.reduce((flatChildren, item) => {
    flatChildren.push(item.id);
    if (item.children) {
      flatChildren = flatChildren.concat(getFlatChildrenIds(item.children));
    }
    return flatChildren;
  }, []);

const getChildrenById = (items, id) => {
  let children;
  items.some(item => {
    if (item.id === id) {
      children = item.children;
      return true;
    }
    if (item.children) {
      children = getChildrenById(item.children, id);

      if (children) {
        return true;
      }
    }
    return false;
  });
  return children;
};

export default class NestedMenu extends Component {
  static getDerivedStateFromProps(nextProps, prevState = {}) {
    const { items, expandAll } = nextProps;
    const { originalExpandAll, items: stateItems = [] } = prevState;

    if (
      items.toString() !== stateItems.toString() ||
      expandAll !== originalExpandAll
    ) {
      const collapsibleItems = getCollapsibleItems(items);
      let expandedItems;
      if (typeof expandAll !== "undefined") {
        expandedItems = expandAll ? collapsibleItems : [];
      } else {
        expandedItems = getExpandedItems(items);
      }

      const allExpanded =
        typeof expandAll !== "undefined"
          ? expandAll
          : collapsibleItems.length === expandedItems.length;
      return {
        expandedItems,
        items,
        collapsibleItems,
        allExpanded,
        expandAll,
        originalExpandAll: expandAll
      };
    }

    return null;
  }
  state = {};
  buttonRefs = {};
  onMenuChange = (id, expanded) => {
    const { items } = this.props;
    const { collapsibleItems, expandedItems } = this.state;

    let newExpandedItems = [...expandedItems];

    if (expanded) {
      const toBeCollapsed = [
        id,
        ...getFlatChildrenIds(getChildrenById(items, id))
      ];
      newExpandedItems = newExpandedItems.filter(
        item => toBeCollapsed.indexOf(item) < 0
      );
    } else {
      newExpandedItems.push(id);
    }

    this.setState({
      expandedItems: newExpandedItems,
      expandAll: undefined,
      allExpanded: collapsibleItems.length === newExpandedItems.length
    });
  };
  renderItem = (item, level = 1) => {
    const { activeItem, onSelect } = this.props;
    const { expandAll, expandedItems } = this.state;
    const { children, id, label } = item;
    const isExpanded = expandedItems.includes(id);
    //console.log(expandAll);
    const open = typeof expandAll !== "undefined" ? expandAll : isExpanded;

    const itemId = `item_${id}_${level}`;

    let activeStyle;
    if (activeItem && activeItem.id === id) {
      activeStyle = {
        background: "rgba(61,19,141,0.1)"
      };
    }

    const content = (
      <Button
        style={activeStyle}
        ref={ref => (this.buttonRefs[id] = ref)}
        onClick={() =>
          children ? this.onMenuChange(id, open) : onSelect(item)
        }
        hoverIndicator={{ color: "neutral-1", opacity: "weak" }}
      >
        <Box
          direction="row"
          align="center"
          pad="xsmall"
          style={{
            marginLeft: children ? `${12 * level}px` : `${16 * level}px`
          }}
        >
          {children &&
            (open ? <FormDown color="brand" /> : <FormNext color="brand" />)}
          <Text size="small">
            {children ? <strong>{label}</strong> : label}
          </Text>
        </Box>
      </Button>
    );
    return (
      <Fragment key={itemId}>
        {children ? (
          <Keyboard
            onDown={() => this.onMenuChange(id, false, false)}
            onRight={() => this.onMenuChange(id, false)}
            onUp={() => this.onMenuChange(id, true)}
            onLeft={() => this.onMenuChange(id, true)}
          >
            {content}
          </Keyboard>
        ) : (
          content
        )}
        {children &&
          (open && children.map(child => this.renderItem(child, level + 1)))}
      </Fragment>
    );
  };
  render() {
    const { items } = this.props;
    const { allExpanded } = this.state;
    return (
      <Fragment>
        <Box pad={{ horizontal: "small" }} align="end">
          <Anchor
            href="#"
            onClick={event => {
              event.preventDefault();
              this.setState({
                expandAll: !allExpanded,
                allExpanded: !allExpanded,
                expandedItems: allExpanded ? [] : items.map(({ id }) => id)
              });
            }}
          >
            <Text color="brand" size="small">
              {allExpanded ? "Collapse All" : "Expand All"}
            </Text>
          </Anchor>
        </Box>
        {items.map(item => this.renderItem(item, 1))}
      </Fragment>
    );
  }
}
