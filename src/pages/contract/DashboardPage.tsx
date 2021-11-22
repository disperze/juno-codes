import React from "react";
import { FooterRow } from "../../components/FooterRow";
import { Header } from "../../components/Header";

export function DashboardPage(): JSX.Element {

  return (
    <div className="page">
      <Header />
      <div className="container mt-3 contract-container">
        <div>
          Hello
        </div>
        <FooterRow />
      </div>
    </div>
  );
}
