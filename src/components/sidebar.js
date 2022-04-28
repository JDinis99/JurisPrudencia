import React, { Component } from "react";
import PropTypes from "prop-types";

import { Box, Heading, Text } from "grommet";
import { Dislike } from "grommet-icons";

import SearchInput from "./searchInput";
import NestedMenu from "./nestedMenu";


const filterItems = (items, query) => {
  console.log("Query: ", query)
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
    allMenuItems  = this.props.allMenuItems
    static = {
    onItemSelect: PropTypes.func.isRequired
  };
  state = {
    activeItem: undefined,
    searchQuery: "",
    menuItems: this.allMenuItems
  };
  renderNoMatch = () => (
    <Box pad={{ top: "medium" }} align="center" justify="center" gap="small">
      <Dislike size="large" />
      <Text size="small">Nenhuma entidade encontrada</Text>
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
          background={{ color: "gold", dark: false }}
          elevation="xsmall"
        >
          <Heading level={3}>Entidades</Heading>
        </Box>
        <Box flex={false} pad="small">
          <SearchInput
            value={searchQuery}
            onChange={({ target: { value: searchQuery } }) =>
              this.setState({
                searchQuery,
                menuItems: filterItems(this.allMenuItems, searchQuery)
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
                  //console.log("activeItem: ", activeItem)
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
