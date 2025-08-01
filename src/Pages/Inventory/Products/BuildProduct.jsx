import axios from "axios";
import { useEffect, useState } from "react";
import {
    Button,
    Card,
    Col,
    Container,
    FloatingLabel,
    Form,
    Row,
    Spinner,
} from "react-bootstrap";

const BuildProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    offer_price: "",
    manufacturer_id: "",
    regular_price: "",
    description: "",
    photo: null,
    product_category_id: "",
    product_section_id: "",
    is_featured: false,
    star: "",
    is_brand: false,
    offer_discount: "",
    uom_id: "",
    weight: "",
    barcode: "",
    product_type_id: "",
    product_unit_id: "",
  });

  const [dropdownData, setDropdownData] = useState({
    manufacturers: [],
    product_categories: [],
    product_sections: [],
    uoms: [],
    product_types: [],
    product_units: [],
  });

  const [loading, setLoading] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(true);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const endpoints = [
          "manufacturer",
          "productcategory",
          "productsection",
          "uom",
          "producttype",
          "productunit",
        ];

        const requests = endpoints.map((endpoint) =>
          axios.get(
            `/api/${endpoint}`
          )
        );

        const responses = await Promise.all(requests);

        setDropdownData({
          manufacturers: responses[0].data.manufacturers,
          product_categories: responses[1].data.product_categories,
          product_sections: responses[2].data.product_sections,
          uoms: responses[3].data.uoms,
          product_types: responses[4].data.product_types,
          product_units: responses[5].data.product_units,
        });

        setDropdownLoading(false);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        setDropdownLoading(false);
      }
    };

    fetchDropdownData();
  }, []);
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
    
      const payload = { ...formData };

     
      payload.is_featured = formData.is_featured ? 1 : 0;
      payload.is_brand = formData.is_brand ? 1 : 0;

     
      if (formData.photo instanceof File) {
       
        const photoFormData = new FormData();
        photoFormData.append("photo", formData.photo);
      
      }

    

      const response = await axios.post(
        "/api/product/save",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          
          },
        }
      );

     
      if (response.data.success) {
        alert("Product saved successfully!");
        // Reset form after successful submission
        setFormData({
          name: "",
          offer_price: "",
          manufacturer_id: "",
          regular_price: "",
          description: "",
          photo: null,
          product_category_id: "",
          product_section_id: "",
          is_featured: false,
          star: "",
          is_brand: false,
          offer_discount: "",
          uom_id: "",
          weight: "",
          barcode: "",
          product_type_id: "",
          product_unit_id: "",
        });
      } else {
        alert(
          response.data.message || "Product saved but no success flag returned"
        );
      }
    } catch (error) {
      console.error("Error saving product:", error);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
        alert(
          `Error: ${error.response.data.message || error.response.statusText}`
        );
      } else {
        alert("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderDropdown = (items, name, placeholder) => {
    if (dropdownLoading) {
      return (
        <Form.Select disabled>
          <option>Loading...</option>
        </Form.Select>
      );
    }

    return (
      <Form.Select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required
      >
        <option value="">Select {placeholder}</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name || item.title}
          </option>
        ))}
      </Form.Select>
    );
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Build Product</h4>
              <Button variant="success" href="/product">
                Manage Product
              </Button>
            </Card.Header>

            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <FloatingLabel
                      controlId="name"
                      label="Product Name"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Product Name"
                        required
                      />
                    </FloatingLabel>
                  </Col>

                  <Col md={6}>
                    <FloatingLabel
                      controlId="barcode"
                      label="Barcode"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        name="barcode"
                        value={formData.barcode}
                        onChange={handleChange}
                        placeholder="Barcode"
                      />
                    </FloatingLabel>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FloatingLabel
                      controlId="regular_price"
                      label="Regular Price"
                      className="mb-3"
                    >
                      <Form.Control
                        type="number"
                        name="regular_price"
                        value={formData.regular_price}
                        onChange={handleChange}
                        placeholder="Regular Price"
                        required
                        min="0"
                        step="0.01"
                      />
                    </FloatingLabel>
                  </Col>

                  <Col md={6}>
                    <FloatingLabel
                      controlId="offer_price"
                      label="Offer Price"
                      className="mb-3"
                    >
                      <Form.Control
                        type="number"
                        name="offer_price"
                        value={formData.offer_price}
                        onChange={handleChange}
                        placeholder="Offer Price"
                        min="0"
                        step="0.01"
                      />
                    </FloatingLabel>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FloatingLabel
                      controlId="offer_discount"
                      label="Offer Discount (%)"
                      className="mb-3"
                    >
                      <Form.Control
                        type="number"
                        name="offer_discount"
                        value={formData.offer_discount}
                        onChange={handleChange}
                        placeholder="Offer Discount"
                        min="0"
                        max="100"
                        step="0.01"
                      />
                    </FloatingLabel>
                  </Col>

                  <Col md={6}>
                    <FloatingLabel
                      controlId="weight"
                      label="Weight"
                      className="mb-3"
                    >
                      <Form.Control
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="Weight"
                        min="0"
                        step="0.01"
                      />
                    </FloatingLabel>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="mr-2">Manufacturer</Form.Label>
                      {renderDropdown(
                        dropdownData.manufacturers,
                        "manufacturer_id",
                        "Manufacturer"
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="mr-2">Product Category</Form.Label>
                      {renderDropdown(
                        dropdownData.product_categories,
                        "product_category_id",
                        "Product Category"
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="mr-2">Product Section</Form.Label>
                      {renderDropdown(
                        dropdownData.product_sections,
                        "product_section_id",
                        "Product Section"
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="mr-2">UOM</Form.Label>
                      {renderDropdown(dropdownData.uoms, "uom_id", "UOM")}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="mr-2">Product Type</Form.Label>
                      {renderDropdown(
                        dropdownData.product_types,
                        "product_type_id",
                        "Product Type"
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="mr-2">Product Unit</Form.Label>
                      {renderDropdown(
                        dropdownData.product_units,
                        "product_unit_id",
                        "Product Unit"
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Star Rating</Form.Label>
                      <Form.Control
                        type="number"
                        name="star"
                        value={formData.star}
                        onChange={handleChange}
                        min="0"
                        max="5"
                        step="0.1"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Photo</Form.Label>
                      <Form.Control
                        type="file"
                        name="photo"
                        onChange={handleChange}
                        accept="image/*"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Group className="mb-3 ml-4">
                      <Form.Check
                        type="checkbox"
                        id="is_featured"
                        name="is_featured"
                        label="Is Featured"
                        checked={formData.is_featured}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3 ml-4">
                      <Form.Check
                        type="checkbox"
                        id="is_brand"
                        name="is_brand"
                        label="Is Brand"
                        checked={formData.is_brand}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="mr-2"
                        />
                        Saving...
                      </>
                    ) : (
                      "Save Product"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BuildProduct;
