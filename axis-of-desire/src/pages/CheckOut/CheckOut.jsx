import React from "react";
import "./style.css";
import PageBanner from "../../components/PageBanner/PageBanner";
import { Dot } from "lucide-react";
const CheckOut = () => {
  return (
    <div className="checkout-container">
      <PageBanner heading={"Check Out"} />
      <div className="checkout-content">
        <div className="checkout-content-left">
          <div className="checkout-left-text">
            <span>Billing details</span>
            <div className="checkout-inputs">
              <div className="checkout-name">
                <div className="name-checkout-left-input">
                  <span>First Name</span>
                  <input type="text" placeholder="John" />
                </div>
                <div className="name-checkout-left-input">
                  <span>Last Name</span>
                  <input type="text" placeholder="Virk" />
                </div>
              </div>
              <div className="checkout-left-input">
                <span>Company Name (Optional)</span>
                <input type="text" placeholder="XYZ" />
              </div>
              <div className="checkout-left-dropdown">
                <span>Country / Region</span>
                <div className="dropdown">
                  <select>
                    <option value="">Pakistan</option>
                    <option value="">India</option>
                    <option value="">Canada</option>
                  </select>
                </div>
              </div>

              <div className="checkout-left-input">
                <span>Street address</span>
                <input type="text" placeholder="Street no 5 gulbarg" />
              </div>

              <div className="checkout-left-input">
                <span>Town / City</span>
                <input type="text" placeholder="Lahore" />
              </div>

              <div className="checkout-left-dropdown">
                <span>Province</span>
                <div className="dropdown">
                  <select>
                    <option value="">Punjab</option>
                    <option value="">Sindh</option>
                    <option value="">KPK</option>
                  </select>
                </div>
              </div>

              <div className="checkout-left-input">
                <span>ZIP code</span>
                <input type="text" placeholder="4200" />
              </div>
              <div className="checkout-left-input">
                <span>Phone</span>
                <input type="text" placeholder="+92 111111111" />
              </div>
              <div className="checkout-left-input">
                <span>Email address</span>
                <input type="text" placeholder="expample123@gmail.com" />
              </div>
            </div>
          </div>
        </div>
        <div className="checkout-content-right">
          <div className="checkout-right-heading">
            <span>Product</span>
            <span>Subtotal</span>
          </div>
          <div className="checkout-product-detail">
            <div className="checkout-right-heading">
              <p>Asgaard sofa</p>
              <p>$ 10,300</p>
            </div>
            <div className="checkout-right-heading">
              <p style={{ fontSize: "16px" }}>Subtotal</p>
              <p>$ 10,300</p>
            </div>
            <div className="checkout-right-heading">
              <p>Total</p>
              <span>$ 10,300</span>
            </div>
          </div>
          <div className="payment-info">
            <div className="payment-heading">
              <Dot color="white" size={40} />
              <span>Direct Bank Transfer</span>
            </div>
            <div className="payment-text">
              <p>
                Make your payment directly into our bank account. Please use
                your Order ID as the payment reference. Your order will not be
                shipped until the funds have cleared in our account.
              </p>
            </div>

            <div className="payment-options">
              <div className="payment-option-box">
                <input type="radio" name="" id="" />
                <span>Direct Bank Transfer</span>
              </div>
              <div className="payment-option-box">
                <input type="radio" name="" id="" />
                <span>Cash On Delivery</span>
              </div>
            </div>
            <div className="payment-text">
              <p style={{color:"white"}}>
                Your personal data will be used to support your experience
                throughout this website, to manage access to your account, and
                for other purposes described in our privacy policy.
              </p>
            </div>
            <div className="checkout-btn">
                <button>Place order</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
