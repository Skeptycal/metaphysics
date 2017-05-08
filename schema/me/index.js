import date from "../fields/date"
import gravity from "../../lib/loaders/gravity"
import Bidders from "./bidders"
import BidderStatus from "./bidder_status"
import BidderPositions from "./bidder_positions"
import LotStanding from "./lot_standing"
import LotStandings from "./lot_standings"
import SaleRegistrations from "./sale_registrations"
import SuggestedArtists from "./suggested_artists"
import FollowArtists from "./follow_artists"
import FollowedArtists from "./followed_artists"
import Notifications from "./notifications"
import Conversations from "./conversations"
import CollectorProfile from "./collector_profile"
import ArtworkInquiries from "./artwork_inquiries"
import { IDFields, NodeInterface } from "../object_identification"
import { queriedForFieldsOtherThanBlacklisted } from "../../lib/helpers"
import { GraphQLString, GraphQLObjectType } from "graphql"
import { has } from "lodash"

const Me = new GraphQLObjectType({
  name: "Me",
  interfaces: [NodeInterface],
  isTypeOf: obj => has(obj, "email") && has(obj, "is_collector"),
  fields: {
    ...IDFields,
    artwork_inquiries_connection: ArtworkInquiries,
    bidders: Bidders,
    bidder_status: BidderStatus,
    bidder_positions: BidderPositions,
    collector_profile: CollectorProfile,
    conversations: Conversations,
    created_at: date,
    email: {
      type: GraphQLString,
    },
    follow_artists: FollowArtists,
    followed_artists_connection: FollowedArtists,
    lot_standing: LotStanding,
    lot_standings: LotStandings,
    name: {
      type: GraphQLString,
    },
    notifications_connection: Notifications,
    paddle_number: {
      type: GraphQLString,
    },
    sale_registrations: SaleRegistrations,
    suggested_artists: SuggestedArtists,
    type: {
      type: GraphQLString,
    },
  },
})

export default {
  type: Me,
  resolve: (root, options, request, { rootValue: { accessToken, userID }, fieldNodes }) => {
    if (!accessToken) return null

    const blacklistedFields = [
      "id",
      "__id",
      "follow_artists",
      "suggested_artists",
      "bidders",
      "bidder_positions",
      "bidder_status",
      "lot_standing",
      "lot_standings",
      "sale_registrations",
      "conversations",
      "collector_profile",
      "artwork_inquiries_connection",
      "notifications_connection",
    ]
    if (queriedForFieldsOtherThanBlacklisted(fieldNodes, blacklistedFields)) {
      return gravity.with(accessToken)("me").catch(() => null)
    }

    // The email and is_collector are here so that the type system's `isTypeOf`
    // resolves correctly when we're skipping gravity data
    return { id: userID, email: null, is_collector: null }
  },
}
