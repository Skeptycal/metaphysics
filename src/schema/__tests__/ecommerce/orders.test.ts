/* eslint-disable promise/always-return */

import { runQuery } from "test/utils"
import { mockxchange } from "test/fixtures/exchange/mockxchange"
import sampleOrder from "test/fixtures/results/sample_order"
import exchangeOrdersJSON from "test/fixtures/exchange/orders.json"
import gql from "lib/gql"
import { OrderSellerFields } from "./order_fields"

let rootValue

describe("Orders query", () => {
  beforeEach(() => {
    const resolvers = { Query: { orders: () => exchangeOrdersJSON } }
    rootValue = mockxchange(resolvers)
  })
  it("fetches orders by seller id", () => {
    const query = gql`
      {
        orders(sellerId: "581b45e4cd530e658b000124") {
          totalCount
          edges {
            node {
              ${OrderSellerFields}
            }
          }
        }
      }
    `

    return runQuery(query, rootValue).then(data => {
      expect(data!.orders.totalCount).toEqual(100)
      expect(data!.orders.edges[0].node).toEqual(sampleOrder(true, false))
    })
  })
})
