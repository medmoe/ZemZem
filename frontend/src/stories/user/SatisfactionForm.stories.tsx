import React from 'react'
import {ComponentStory, ComponentMeta} from "@storybook/react";
import {SatisfactionForm} from "../../features/user/SatisfactionForm";
import {withRouter} from "storybook-addon-react-router-v6";
import {Provider} from 'react-redux'
import {store} from '../../app/store'
import {action} from "@storybook/addon-actions";
export default {
    name: 'satisfaction form',
    component: SatisfactionForm,
    decorators: [(story) =><Provider store={store}>{story()}</Provider>, withRouter],
    parameters: {
        layout: 'fullscreen',
    },
} as ComponentMeta<typeof SatisfactionForm>

const Template: ComponentStory<typeof SatisfactionForm> = (args) => <SatisfactionForm {...args} />;
export const Submit = Template.bind({})
Submit.args = {
    submitFeedback: action("something"),
}
