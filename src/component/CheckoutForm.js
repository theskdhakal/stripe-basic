import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import "./Checkout.css";
import Swal from "sweetalert2";
import axios from "axios";

const initialState = {
  name: "",
  email: "",
  phone: "",
};
const CheckoutForm = () => {
  const [form, setForm] = useState(initialState);
  const stripe = useStripe();
  const elements = useElements();

  const handleSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Your payment was successful",
      timer: 4000,
      allowOutsideClick: false,
    });
  };

  const handleFail = () => {
    Swal.fire({
      icon: "error",
      title: "Something went wrong. Your payment was not successful!",
      timer: 4000,
      allowOutsideClick: false,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      return;
    }

    const { data } = await axios({
      method: "post",
      url: "http://localhost:8000/api/v1/payment/create-payment-intent",
      data: {
        amount: 30000,
        currency: "aud",
      },
    });

    const { clientSecret } = data;

    const { paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: { return_url: "http://localhost:3000" },
      redirect: "if_required",
    });

    if (paymentIntent.status === "succeeded") {
      handleSuccess();
    } else {
      handleFail();
    }
  };
  return (
    <div>
      <Form onSubmit={handleSubmit} className="form">
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Phone</Form.Label>
          <Form.Control type="number" name="phone" onChange={handleChange} />
        </Form.Group>

        <PaymentElement />

        <Button type="submit">PAY NOW</Button>
      </Form>
    </div>
  );
};
export default CheckoutForm;
