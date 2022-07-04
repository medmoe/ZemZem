import React from 'react'
import {ComponentStory, ComponentMeta} from "@storybook/react";
import {NavigationBar} from "../../features/homepage/NavigationBar";
import { withRouter } from 'storybook-addon-react-router-v6'

export default {
    title: 'navigation bar',
    component: NavigationBar,
    decorators: [withRouter],
    parameters: {
        layout: 'fullscreen',
    },
} as ComponentMeta<typeof NavigationBar>;

const Template: ComponentStory<typeof NavigationBar> = (args) => <NavigationBar  {...args} />
export const NotAuthenticated = Template.bind({});
NotAuthenticated.args = {
    username: undefined,
    isAuthenticated: false,
}

export const Authenticated = Template.bind({});
Authenticated.args = {
    username: 'Mohammed',
    isAuthenticated: true,
}