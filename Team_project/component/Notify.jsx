import { notification } from "antd";

const Notify = ({ type, message, description, placement = "topRight" }) => {
  notification[type]({
    message,
    description,
    placement,
  });
};

export default Notify;
