import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { formatDate } from "@/lib/helper";
import { useLeaseStore } from "@/store/leaseStore";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.4,
  },
  section: {
    marginBottom: 15,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
  },
  label: {
    color: "#555",
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  column: {
    flexDirection: "column",
    flexGrow: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#e4e4e4",
    marginVertical: 8,
  },
});

const MyDoc = () => {
  const { leaseData } = useLeaseStore();
  if (
    !leaseData ||
    !leaseData.lease ||
    !leaseData.tenant ||
    !leaseData.rent ||
    !leaseData.escalations ||
    !leaseData.recoveries ||
    !leaseData.security ||
    !leaseData.renewalOptions
  ) {
    return null;
  }

  const startDate = new Date(leaseData.lease.startDate).getTime();
  const endDate = new Date(leaseData.lease.expiryDate).getTime();
  const today = new Date().getTime();
  const totalDuration = endDate - startDate;
  const elapsedDuration = today - startDate;
  const percentComplete = Math.max(
    0,
    Math.min(100, (elapsedDuration / totalDuration) * 100)
  );

  const leaseIcon = "/main-logo.svg";

  return (
    <Document>
      <Page style={styles.page}>
        {/* Key Lease Metrics */}
        <View style={styles.section}>
          <Image src={leaseIcon} style={styles.icon} />
          <Text style={styles.title}>Key Lease Metrics</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Tenant:</Text>
            <Text>
              {leaseData.tenant.name} ({leaseData.tenant.creditRating})
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Lease Term:</Text>
            <Text>
              {leaseData.lease.term} ({Math.round(percentComplete)}% Complete)
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Base Rent PSF:</Text>
            <Text>
              {leaseData.rent.baseRentPSF} (Escalation:{" "}
              {leaseData.escalations.rate})
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Lease Type:</Text>
            <Text>{leaseData.recoveries.operatingExpenses}</Text>
          </View>
        </View>

        {/* Tenant Info */}
        <View style={styles.section}>
          <Text style={styles.title}>Tenant Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Industry:</Text>
            <Text>{leaseData.tenant.industry}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Credit Rating:</Text>
            <Text>{leaseData.tenant.creditRating}</Text>
          </View>
        </View>

        {/* Lease Term */}
        <View style={styles.section}>
          <Text style={styles.title}>Lease Term</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Start Date (LCD):</Text>
            <Text>{formatDate(leaseData.lease.startDate)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>End Date (LXD):</Text>
            <Text>{formatDate(leaseData.lease.expiryDate)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Original Term:</Text>
            <Text>{leaseData.lease.term}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Remaining Term:</Text>
            <Text>{leaseData.lease.remainingTerm}</Text>
          </View>
        </View>

        {/* Rent Structure */}
        <View style={styles.section}>
          <Text style={styles.title}>Rent Structure</Text>
          {[
            "baseRentPSF",
            "annualBaseRent",
            "monthlyBaseRent",
            "effectiveRentPSF",
          ].map((key) => (
            <View key={key} style={styles.row}>
              <Text style={styles.label}>
                {key.replace(/([A-Z])/g, " $1")}:
              </Text>
              {/* @ts-ignore */}
              <Text>{leaseData.rent[key]}</Text>
            </View>
          ))}
        </View>

        {/* Escalations */}
        <View style={styles.section}>
          <Text style={styles.title}>Escalations</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Structure:</Text>
            <Text>{leaseData.escalations.structure}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Rate:</Text>
            <Text>{leaseData.escalations.rate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Next Escalation:</Text>
            <Text>{leaseData.escalations.nextEscalation}</Text>
          </View>
        </View>

        {/* Recovery Terms */}
        <View style={styles.section}>
          <Text style={styles.title}>Recovery Terms</Text>
          {["operatingExpenses", "cam", "insurance", "taxes"].map((key) => (
            <View key={key} style={styles.row}>
              <Text style={styles.label}>
                {key.replace(/([A-Z])/g, " $1")}:
              </Text>
              {/* @ts-ignore */}
              <Text>{leaseData.recoveries[key]}</Text>
            </View>
          ))}
        </View>

        {/* Renewal Options */}
        <View style={styles.section}>
          <Text style={styles.title}>Renewal Options</Text>
          {leaseData.renewalOptions.map((option, index) => (
            <View key={index} style={{ marginBottom: 6 }}>
              <Text style={{ marginBottom: 2 }}>Option {index + 1}</Text>
              <Text style={styles.label}>Term: {option.term}</Text>
              <Text style={styles.label}>Notice Period: {option.notice}</Text>
              <Text style={styles.label}>
                Rent Structure: {option.rentStructure}
              </Text>
              <View style={styles.divider} />
            </View>
          ))}
        </View>

        {/* Security */}
        <View style={styles.section}>
          <Text style={styles.title}>Security</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Deposit:</Text>
            <Text>{leaseData.security.deposit}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Equivalent:</Text>
            <Text>{leaseData.security.equivalent}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Letter of Credit:</Text>
            <Text>{leaseData.security.letterOfCredit}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MyDoc;
