import { useEffect, useState } from "react";
import BodyWrapper from "../../components/BodyWrapper";
import { Button, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  stateCart,
  stateLoggedInUserType,
} from "../../../types/type-definitions";
import { store } from "../../store/root-reducer";
import {
  emptyCart,
  removeMembershipPlan,
  removePackagesAndServices,
  removeResource,
} from "../../store/actions/shopping-cart";
import ToastComponent from "../../components/ToastComponent";
import { Link } from "react-router-dom";

function SchoolCheckout() {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector(
    (state: stateLoggedInUserType) => state.userInfo.loggedInUserData
  );

  //cart items
  const cartResources = useSelector((state: stateCart) => state.cart.resources);
  const cartPackagesAndServices = useSelector(
    (state: stateCart) => state.cart.packagesAndServices
  );
  const cartMembershipPlans = useSelector(
    (state: stateCart) => state.cart.membershipPlans
  );

  const pounds = Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  });

  useEffect(() => {
    priceTotalResources();
  }, [cartResources, cartPackagesAndServices, cartMembershipPlans]);

  const [totalCost, setTotalCost] = useState<number>(0);

  const priceTotalResources = () => {
    const resourcesTotal = cartResources.reduce((acc, val: any) => {
      return Number(acc) + Number(val.amount);
    }, 0);
    const membershipPlansTotal = cartMembershipPlans.reduce((acc, val: any) => {
      return Number(acc) + Number(val.amount);
    }, 0);
    const packagesAndServicesTotal = cartPackagesAndServices.reduce(
      (acc, val: any) => {
        return Number(acc) + Number(val.amount);
      },
      0
    );
    let sum =
      Number(resourcesTotal) +
      Number(membershipPlansTotal) +
      Number(packagesAndServicesTotal);
    setTotalCost(Number(sum));
  };
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  //Toast information
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState<string | null>(null);
  const [toastBody, setToastBody] = useState<string | null>(null);

  async function submitCart() {
    try {
      setIsSubmitting(true);
      const res = await axios.post(
        `${baseUrl}/api/submit-cart`,
        {
          cartResources,
          cartMembershipPlans,
          cartPackagesAndServices,
          schoolId: userInfoData.userId,
          billingAddress: userInfoData.userAddress,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userInfoData.token}`,
          },
          timeout: 30000,
        }
      );
      const resData = res.data;
      console.log(resData);
      if (resData.success === false) {
        if (resData.errors !== undefined) {
        } else {
        }
      } else {
        setToastTitle("Success");
        setToastBody("Your order has been placed..");
        setShowToast(true);
        store.dispatch(emptyCart());
      }
      setIsSubmitting(false);
    } catch (e: any) {
      console.log(e);
      if (e.code === "ECONNABORTED") {
        setIsSubmitting(false);
      }
      if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
        // setErrors(errorData.errors);
        if (errorData.message === "Unauthenticated.") {
          // store.dispatch(deleteUserData());
        }
      }
      setIsSubmitting(false);
    }
  }

  return (
    <BodyWrapper title="Checkout">
      {userInfoData.planExpired === true && (
        <Alert className="form-feedback-message" variant={"danger"} dismissible>
          <div>
            Your membership plan has expired. Click{" "}
            <Link to={"/membership-plans"}>here</Link> to subscribe to a new
            membership plan.
          </div>
        </Alert>
      )}
      <Row>
        <Col md={"8"}>
          <Card className="checkout-items-card mb-3">
            <Card.Body>
              <Card.Title className="checkout-items-card-title">
                Cart
              </Card.Title>
              <div className="checkout-items-card-border mb-3 mt-3"></div>
              {cartMembershipPlans.length +
                cartResources.length +
                cartPackagesAndServices.length >
              0 ? (
                <div>
                  {cartMembershipPlans.map((item: any, index: any) => {
                    return (
                      <Card.Text
                        className="checkout-items-card-list"
                        key={index}
                      >
                        <div>
                          <Card.Subtitle className="mb-2 checkout-items-card-text">
                            {item.name}
                          </Card.Subtitle>
                          <Card.Subtitle className="mb-2 checkout-items-card-sub-title">
                            {pounds.format(item.amount)}
                          </Card.Subtitle>
                        </div>
                        <Button
                          className="mb-3"
                          variant="light"
                          onClick={() => {
                            store.dispatch(removeMembershipPlan(item));
                          }}
                        >
                          Remove
                        </Button>
                      </Card.Text>
                    );
                  })}

                  {cartResources.map((item: any, index: any) => {
                    return (
                      <Card.Text
                        className="checkout-items-card-list"
                        key={index}
                      >
                        <div>
                          <Card.Subtitle className="mb-2 checkout-items-card-text">
                            {item.name}
                          </Card.Subtitle>
                          <Card.Subtitle className="mb-2 checkout-items-card-sub-title">
                            {pounds.format(item.amount)}
                          </Card.Subtitle>
                        </div>
                        <Button
                          className="mb-3"
                          variant="light"
                          onClick={() => {
                            store.dispatch(removeResource(item));
                          }}
                        >
                          Remove
                        </Button>
                      </Card.Text>
                    );
                  })}

                  {cartPackagesAndServices.map((item: any, index: any) => {
                    return (
                      <Card.Text
                        className="checkout-items-card-list"
                        key={index}
                      >
                        <div>
                          <Card.Subtitle className="mb-2 checkout-items-card-text">
                            {item.name}
                          </Card.Subtitle>
                          <Card.Subtitle className="mb-2 checkout-items-card-sub-title">
                            {pounds.format(item.amount)}
                          </Card.Subtitle>
                        </div>
                        <Button
                          className="mb-3"
                          variant="light"
                          onClick={() => {
                            store.dispatch(removePackagesAndServices(item));
                          }}
                        >
                          Remove
                        </Button>
                      </Card.Text>
                    );
                  })}
                  <div className="checkout-items-card-border mb-3 mt-3"></div>
                  <Card.Subtitle className="mb-2 checkout-items-card-sub-title">
                    Address
                  </Card.Subtitle>
                  <Card.Text className="checkout-items-card-text">
                    {userInfoData.userAddress}
                  </Card.Text>
                </div>
              ) : (
                <Card.Text className="checkout-items-card-text">
                  Cart is empty
                </Card.Text>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={"4"}>
          <Card className="checkout-card mb-3">
            <Card.Body>
              <Card.Subtitle className="mb-2 checkout-card-sub-title"></Card.Subtitle>
              <Card.Subtitle className="mb-2 checkout-card-sub-title">
                Total
              </Card.Subtitle>
              <div className="checkout-card-border mb-3 mt-3"></div>
              <Card.Title className="checkout-card-title">
                {pounds.format(Number(totalCost))}
              </Card.Title>
              <div className="checkout-card-border mb-3 mt-3"></div>
              {cartMembershipPlans.length +
                cartResources.length +
                cartPackagesAndServices.length >
                0 && (
                <Button
                  className="btn-block mb-3 form-control btn-custom"
                  disabled={!!isSubmitting}
                  onClick={() => {
                    setToastTitle("Oops");
                    setToastBody("Your membership plan has expired.");
                    if (userInfoData.planExpired === true) {
                      setShowToast(true);
                    } else {
                      submitCart();
                    }
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      <span> Processing..</span>
                    </>
                  ) : (
                    " Generate Invoice"
                  )}
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {toastBody && toastTitle && (
        <ToastComponent
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide={true}
          title={toastTitle}
          body={toastBody}
        />
      )}
    </BodyWrapper>
  );
}

export default SchoolCheckout;
