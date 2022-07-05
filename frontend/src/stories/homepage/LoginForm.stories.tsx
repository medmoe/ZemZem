import React from 'react'
import {ComponentStory, ComponentMeta} from "@storybook/react";
import {LoginForm} from "../../features/customer/LoginForm";
import {withRouter} from "storybook-addon-react-router-v6";

export default {
    name: 'login form',
    component: LoginForm,
    decorators: [withRouter],
    parameters: {
        layout: 'fullscreen',

    },
} as ComponentMeta<typeof LoginForm>

const Template: ComponentStory<typeof LoginForm> = (args) => <LoginForm  {...args} />
export const ShowLoginForm = Template.bind({});
ShowLoginForm.args = {}