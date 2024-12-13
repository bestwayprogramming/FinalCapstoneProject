import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Typography,
  Row,
  Col,
  Card,
  Divider,
  Skeleton,
  Flex,
  Image,
  Upload,
  Tag,
  Space,
  message,
} from "antd";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchuserprofile, updateUserProfile } from "../feature/auth/authSlice";
import ImgCrop from "antd-img-crop";

const { Title, Text } = Typography;
const { Option } = Select;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const AddressManagement = () => {
  const { userinfo, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // const [previewOpen, setPreviewOpen] = useState(false);
  // const [previewImage, setPreviewImage] = useState("");
  // const [fileList, setFileList] = useState([]);

  // const [changeImage, setChangeImage] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    accountType: "",
    email: "",
    addresses: [
      {
        label: "Home",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        isDefault: false,
      },
    ],
    profilePicture: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle dropdown select changes
  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, accountType: value }));
  };

  // Toggle edit mode
  const toggleEdit = () => {
    const firstAddress = formData.addresses[formData.addresses.length - 1];
    if (firstAddress) {
    if (
      !firstAddress.street ||
      !firstAddress.city ||
      !firstAddress.state ||
      !firstAddress.zipCode ||
      !firstAddress.country
    ) {
      message.error("Please fill in all fields or remove the last address");
      return;
    }
  }
    setIsEditing((prev) => !prev);
  };


  // Handle changes for address fields
  const handleAddressChange = (index, field, value) => {
    const updatedAddresses = [...formData.addresses];
    updatedAddresses[index][field] = value;
    setFormData((prev) => ({ ...prev, addresses: updatedAddresses }));
  };

  // Add a new address
  const addAddress = () => {
    const firstAddress = formData.addresses[formData.addresses.length - 1];
    if (firstAddress){
    if (
      !firstAddress.street ||
      !firstAddress.city ||
      !firstAddress.state ||
      !firstAddress.zipCode ||
      !firstAddress.country
    ) {
      message.error("Please fill in all fields or remove the last address");
      return;
    }
  }

    setFormData((prev) => ({
      ...prev,
      addresses: [
        ...prev.addresses,
        {
          label: "Shipping",
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
          isDefault: false,
        },
      ],
    }));
  };

  // Save updated profile details
  const handleSave = () => {
    const firstAddress = formData.addresses[formData.addresses.length - 1];
    if (
      !firstAddress.street ||
      !firstAddress.city ||
      !firstAddress.state ||
      !firstAddress.zipCode ||
      !firstAddress.country
    ) {
      message.error("Please fill in all fields of the primary address.");
      return;
    }

    dispatch(updateUserProfile(formData));
    setIsEditing(false);
  };

  const handleProfileChange = () => {
    // setChangeImage("");
  };

  const handledefaultAddressChange = (selectedAddress) => {
    if (
      !selectedAddress.label ||
      !selectedAddress.street ||
      !selectedAddress.city ||
      !selectedAddress.state ||
      !selectedAddress.zipCode ||
      !selectedAddress.country
    ) {
      message.error("Please fill in all fields of the primary address.");
      return;
    }
    const updatedAddresses = formData.addresses.map((address) => ({
      ...address,
      isDefault: address === selectedAddress,
    }));

    setFormData((prevState) => ({
      ...prevState,
      addresses: updatedAddresses,
    }));

    // Dispatch the updated user profile to the backend
    dispatch(updateUserProfile({ ...formData, addresses: updatedAddresses }));
  };

  const deleteAddress = (index) => {
    const updatedAddresses = formData.addresses.filter(
      (addr, i) => i !== index
    );
    setFormData((prevState) => ({
      ...prevState,
      addresses: updatedAddresses,
    }));

    dispatch(updateUserProfile({ ...formData, addresses: updatedAddresses }));
  };

  useEffect(() => {
    const email = localStorage.getItem("user");
    if (email) {
      dispatch(fetchuserprofile({ email }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (userinfo) {
      setFormData({
        firstName: userinfo.firstName || "",
        lastName: userinfo.lastName || "",
        mobile: userinfo.mobile || "",
        accountType: userinfo.accountType || "",
        email: userinfo.email || "",
        addresses: userinfo.addresses ? userinfo.addresses : formData.addresses,
        profilePicture: userinfo.profilePicture,
      });
      // setChangeImage(userinfo.profilePicture);
    }
  }, [userinfo]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Card className="w-full max-w-2xl p-6 shadow-lg">
        <Flex vertical gap={"large"} align="center">
          <Title level={3}>Select Shipping Address</Title>
        </Flex>
        <Divider />
        <Form layout="vertical">
          {formData.addresses.map((address, index) => (
            <Space
              key={index}
              direction="vertical"
              size="middle"
              style={{
                display: "flex",
              }}
            >
              <div key={index}>
                <Flex justify="flex-end" align="center">
                  {/* Default Address Check */}
                  {address.isDefault ? (
                    <Tag color="blue" style={{ padding: "6px 12px" }}>
                      Current Shipping Address
                    </Tag>
                  ) : (
                    <Tag.CheckableTag
                      checked={address.isDefault}
                      onChange={() => handledefaultAddressChange(address)}
                      style={{
                        borderColor: "gray",
                        color: "black",
                        borderRadius: "4px",
                        padding: "6px 12px",
                        transition: "background-color 0.3s ease",
                      }}
                    >
                      {address.label} Address
                    </Tag.CheckableTag>
                  )}
                  {!address.isDefault && (
                    <Button
                      type="dashed"
                      danger
                      style={{ marginRight: "10px" }}
                      onClick={() => deleteAddress(index)}
                    >
                      Delete
                    </Button>
                  )}
                </Flex>

                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Form.Item label="Label">
                      <Input
                        value={address.label}
                        onChange={(e) =>
                          handleAddressChange(index, "label", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Street">
                      <Input
                        value={address.street}
                        onChange={(e) =>
                          handleAddressChange(index, "street", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="City">
                      <Input
                        value={address.city}
                        onChange={(e) =>
                          handleAddressChange(index, "city", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Form.Item label="State">
                      <Input
                        value={address.state}
                        onChange={(e) =>
                          handleAddressChange(index, "state", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Zip Code">
                      <Input
                        value={address.zipCode}
                        onChange={(e) =>
                          handleAddressChange(index, "zipCode", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Country">
                      <Input
                        value={address.country}
                        onChange={(e) =>
                          handleAddressChange(index, "country", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Divider />
              </div>
            </Space>
          ))}
          {isEditing && (
            <Button
              type="dashed"
              onClick={addAddress}
              className="my-4"
              size="large"
            >
              Add Address
            </Button>
          )}

          <Divider></Divider>

          <div className="flex justify-end gap-4">
            {isEditing ? (
              <>
                <Flex gap="middle">
                  <Button onClick={toggleEdit} size="large">
                    Cancel
                  </Button>
                  <Button type="primary" onClick={handleSave} size="large">
                    Save Changes
                  </Button>
                </Flex>
              </>
            ) : (
              <Button type="primary" onClick={toggleEdit} size="large">
                Edit Address
              </Button>
            )}
          </div>
        </Form>
      </Card>
    </>
  );
};

export default AddressManagement;
