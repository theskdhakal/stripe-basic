import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./component/CheckoutForm";

function App() {
  const publishableKey = process.env.REACT_APP_STRIPE_PK;

  const stripePromise = loadStripe(
    "pk_test_51NDdMiBpObiPsLHQNcr0pGfL7c2DFxAr3X9Ts86XLHN1QfNOUnwCfZjhW1UrxXJc7r4j3uubfxKvjoytLyKzNfjd00peTWaaak"
  );
  const options = {
    mode: "payment",
    currency: "aud",
    amount: 30000,
  };
  return (
    <div className="App">
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}

export default App;
