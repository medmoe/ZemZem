import React from "react";
import {ComponentStory, ComponentMeta} from "@storybook/react";
import {PropTypes, Button} from "../../components/Button";
import {Provider} from "react-redux";
import {store} from "../../app/store"
import {withRouter} from "storybook-addon-react-router-v6";

export default  {
    name: 'button',
    component: Button,
    decorators: [(story) => <Provider store={store}>{story()}</Provider>, withRouter],
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        backgroundColor: {
            control: 'color',
        }
    }
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = (args) => <Button {...args}/>

export const Primary = Template.bind({});
Primary.args = {
    cssProperties: {
        padding: "16px",
        backgroundColor: "#0000ff",
        textTransform: "uppercase",
        letterSpacing: "2px",
        fontSize: "12px",
        borderRadius: "10px",
    },
    content: "Submit"
}