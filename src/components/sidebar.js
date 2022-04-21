import React, { Component } from "react";
import PropTypes from "prop-types";

import { Box, Heading, Text } from "grommet";
import { Dislike } from "grommet-icons";

import SearchInput from "./searchInput";
import NestedMenu from "./nestedMenu";

const allMenuItems = [
  {
    id: "accordion",
    label: "Accordion",
    expanded: true,
    children: [
      {
        id: "accordion-basic",
        label: "Basic",
        expanded: true,
        children: [
          {
            id: "accordion-basic-default",
            label: "Default",
            data: {Test: "Default"},
          },
          {
            id: "accordion-basic-expanded",
            label: "Expanded"
          }
        ]
      },
      {
        id: "accordion-rich",
        label: "Rich",
        children: [
          {
            id: "accordion-rich-default",
            label: "Default"
          },
          {
            id: "accordion-rich-expanded",
            label: "Expanded"
          }
        ]
      }
    ]
  },
  {
    id: "button",
    label: "Button",
    children: [
      {
        id: "button-default",
        label: "Default"
      }
    ]
  }
];

const filterItems = (items, query) => {
  if (query.length) {
    return JSON.parse(JSON.stringify(items)).filter(item => {
      const { children, label } = item;
      if (label.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
        return true;
      }
      if (children) {
        const items = filterItems(children, query);
        item.children = items;
        if (items.length) {
          return true;
        }
      }
      return false;
    });
  }
  return items;
};

export default class Sidebar extends Component {
  static = {
    onItemSelect: PropTypes.func.isRequired
  };
  state = {
    activeItem: undefined,
    searchQuery: "",
    menuItems: allMenuItems
  };
  renderNoMatch = () => (
    <Box pad={{ top: "medium" }} align="center" justify="center" gap="small">
      <Dislike size="large" />
      <Text size="small">No story matching this query.</Text>
    </Box>
  );
  render() {
    const { activeItem, searchQuery, menuItems } = this.state;
    const { onItemSelect } = this.props;
    return (
      <Box width="medium" background="light-2" elevation="small">
        <Box
          flex={false}
          tag="header"
          pad={{ horizontal: "small" }}
          background={{ color: "brand", dark: false }}
          elevation="xsmall"
        >
          <Heading level={3}>Storybook</Heading>
        </Box>
        <Box flex={false} pad="small">
          <SearchInput
            value={searchQuery}
            onChange={({ target: { value: searchQuery } }) =>
              this.setState({
                searchQuery,
                menuItems: filterItems(allMenuItems, searchQuery)
              })
            }
          />
        </Box>
        <Box flex={true} overflow="auto">
          <Box flex={false}>
            {menuItems.length > 0 ? (
              <NestedMenu
                expandAll={!!searchQuery.length}
                activeItem={activeItem}
                items={menuItems}
                onSelect={activeItem => {
                  this.setState({ activeItem });
                  //onItemSelect(activeItem.id);
                  console.log("activeItem: ", activeItem)
                }}
              />
            ) : (
              this.renderNoMatch()
            )}
          </Box>
        </Box>
      </Box>
    );
  }
}
