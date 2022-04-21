import React, { Component } from "react";

import { Box, TextInput } from "grommet";

import { FormSearch } from "grommet-icons";

export default class SearchInput extends Component {
  state = {
    focus: false
  };
  render() {
    const { focus } = this.state;
    return (
      <Box
        background="white"
        pad={{ horizontal: "xsmall" }}
        round="small"
        direction="row"
        align="center"
        border={{
          side: "all",
          size: "small",
          color: focus ? "brand" : undefined
        }}
        onFocus={() => this.setState({ focus: true })}
        onBlur={() => this.setState({ focus: false })}
      >
        <FormSearch color="brand" />
        <TextInput
          type="search"
          size="small"
          placeholder="Search stories..."
          plain={true}
          {...this.props}
        />
      </Box>
    );
  }
}
