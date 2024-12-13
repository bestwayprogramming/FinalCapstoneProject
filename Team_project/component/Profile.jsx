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

const Profile = () => {
  const { userinfo, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const [changeImage, setChangeImage] = useState("");

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

  const handleFileChange = async ({ fileList: newFileList }) => {
    setFileList(newFileList);

    const imagePromises = newFileList.map(async (file) => {
      if (file.originFileObj) {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        return new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
        });
      }
      return null;
    });

    const imageDataUrls = (await Promise.all(imagePromises)).filter(Boolean);
    setFormData({ ...formData, profilePicture: imageDataUrls });
    setChangeImage(imageDataUrls.toString());
    dispatch(
      updateUserProfile({
        ...formData,
        profilePicture: imageDataUrls.toString(),
      })
    );
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  // Save updated profile details
  const handleSave = () => {
    
    dispatch(updateUserProfile(formData));
    setIsEditing(false);
  };

  const handleProfileChange = () => {
    setChangeImage("");
  };

  const handledefaultAddressChange = (selectedAddress) => {
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
      (addr,i) => i !== index
    );
    setFormData((prevState) => ({
      ...prevState,
      addresses: updatedAddresses,
    }));

    // Dispatch the updated user profile to the backend
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
      setChangeImage(userinfo.profilePicture);
    }
  }, [userinfo]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Navbar />
      <main>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Card className="w-full max-w-2xl p-6 shadow-lg">
            <Flex vertical gap={"large"} align="center">
              <Title level={3}>Profile</Title>

              {(!formData.profilePicture || !changeImage) && (
                <ImgCrop rotationSlider>
                  <Upload
                    name="file"
                    beforeUpload={() => false} // Disable auto-upload, handle manually
                    onChange={handleFileChange}
                    onPreview={handlePreview}
                    listType="picture-card"
                    accept="image/*"
                    fileList={fileList}
                    maxCount={1}
                  >
                    <div>
                      <div style={{ marginBottom: 8 }}>
                        Upload Profile Picture
                      </div>
                    </div>
                  </Upload>
                </ImgCrop>
              )}

              {previewImage && (
                <Image
                  width={200}
                  height={200}
                  src={previewImage}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                />
              )}

              {formData.profilePicture && changeImage && (
                <>
                  <Image
                    width={120}
                    height={120}
                    style={{
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginBottom: 20,
                    }}
                    src={changeImage}
                  />
                  <Button
                    type="dashed"
                    onClick={() => handleProfileChange()}
                    className="my-4"
                  >
                    Change Image
                  </Button>
                </>
              )}

              <Text type="secondary">View and edit your profile details</Text>
            </Flex>
            <Divider />
            <Form layout="vertical">
              <Row gutter={[24, 16]}>
                <Col span={12}>
                  <Form.Item label="First Name">
                    <Input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                      disabled={!isEditing}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Last Name">
                    <Input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                      disabled={!isEditing}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[24, 16]}>
                <Col span={12}>
                  <Form.Item label="Mobile">
                    <Input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="Enter your mobile number"
                      disabled={!isEditing}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Account Type">
                    <Input value={formData.accountType} disabled />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Email">
                <Input
                  type="email"
                  value={formData.email}
                  placeholder="Your email address"
                  disabled
                />
              </Form.Item>

              <Divider>Addresses</Divider>
              {formData.addresses.map((address, index) => (
                <Space
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
                      <Button
                        type="dashed"
                        danger
                        style={{ marginRight: "10px" }}
                        onClick={() => deleteAddress(index)}
                      >
                        Delete
                      </Button>
                    </Flex>

                    <Row gutter={[16, 16]}>
                      <Col span={8}>
                        <Form.Item label="Label">
                          <Input
                            value={address.label}
                            onChange={(e) =>
                              handleAddressChange(
                                index,
                                "label",
                                e.target.value
                              )
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
                              handleAddressChange(
                                index,
                                "street",
                                e.target.value
                              )
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
                              handleAddressChange(
                                index,
                                "state",
                                e.target.value
                              )
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
                              handleAddressChange(
                                index,
                                "zipCode",
                                e.target.value
                              )
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
                              handleAddressChange(
                                index,
                                "country",
                                e.target.value
                              )
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
                    Edit Profile
                  </Button>
                )}
              </div>
            </Form>
          </Card>
        </div>
      </main>
    </>
  );
};

export default Profile;
