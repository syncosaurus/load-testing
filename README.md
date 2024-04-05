# Syncosaurus Load Testing
This repository contains the Artillery load testing library for a Syncosaurus/React project.

## Requirements
You must have a Syncosaurus Durable Object (SDO), either running locally on a dev server or deployed to Cloudflare.

The SDO must have an `increment` mutator defined, as this is used by the Virtual Users (VUs) during load testing.

It is assumed you are familiar with Artillery, and the syntax contained in an Artillery `.yml` test file.

## Quick Start
This package includes a simple ready made test. If you have an SDO running locally on port `8787`, all you need to do to run your first test is `npm run test`.

## Additional Testing
There are two additional `npm` scripts which can be run to load only a specific kind of user.
- `npm run presence`: Only presence users will connect to the SDO. Helpful for simulating a broadcast only use-case; for example a live chat broadcast, a presence-only demo application, etc.
- `npm run increment`: Only increment mutations are sent. Helpful for any use-case where presence data would be disabled; for example a real-time poll.


### Presence vs Mutation VUs
In the default test, there are two kinds of VU scenarios. One will connect to the SDO, and send 'bursty' presence updates in the form of random coordinate positions at a rate of approximately 120/second. The other will connect to the SDO and send periodic mutation updates, approximately 1 per second.

Presence updates are more frequent but computationally much less expensive to process.

Mutations are generally less frequent, but do require much more computational power to process. As mutators are

### Locally testing your SDO
Running tests locally is good for setting up and configuring your Artillery test files, however it **is not indicative of live performance.** There is a major performance *increase* when testing on a local dev server. In order to get realistic performance numbers, you must deploy your server and point the Artillery test at your live endpoint.

## Pushing the limits of your SDO
Generally speaking, SDOs are fairly robust when it comes to total number of messages. However, there is limited RAM available to a deployed SDO, which is used to process requests, maintain websocket connections, broadcast updates, hold shared state in memory, among other things.
### Nearing the limit
As you overload the SDO with too many concurrent client presence/mutation messages, the first performance issue is the dropping of framerate. As the interal SDO event loop fills up, the internal `broadcast` interval events get blocked by the excessive inbound messages from clients. The end result is a noticeable lag in updates from *other users*. It is important to note that even though the server updates slow down, the local application still functions normally, as all mutations are optimistically applied and held until confirmation is received from the server. At time of writing, this slowdown started to occur at 20 concurrent users broadcasting presence data continuously and submitting approximately 5 mutations / second, and increased as more users were added.
### Breaking your SDO
Once the memory for an SDO is full (128mb), new websocket connections will fail and mutation updates will be lost. In a testing environment this didn't occur until after hundreds of concurrent users connected, however in a real-world application with more complex mutation logic, this would likely occur much lower. The exact number is entirely dependent on your application, and must be determined through specific load testing.

## Frontend Viewer App Utility
If you would like to see the live data, there is a frontend react template application which can also connect to the same room the load tester is targeting. It is helpful to be able to view the end-user experience. As noted in the above section, the biggest performance hit is framerate of other user updates. This can be viewed by opening two browser windows and viewing the cursor movement in the second window.

# Cloudflare DDoS protection
While load testing from a single machine should be sufficient (a single computer can create enough VUs in Artillery to overload a single SDO), be mindful with using a cloud-scale test with Artillery. Cloudflare has built in DDoS protections, which may be triggered under certain load testing conditions.
