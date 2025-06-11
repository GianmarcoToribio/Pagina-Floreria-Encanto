import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 5,
  },
  table: {
    display: 'table',
    width: '100%',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    minHeight: 24,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    flex: 1,
    padding: 5,
  },
  total: {
    marginTop: 20,
    textAlign: 'right',
  },
});

interface ReceiptPDFProps {
  sale: any;
}

export const ReceiptPDF: React.FC<ReceiptPDFProps> = ({ sale }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Florería Encanto</Text>
        <Text style={styles.subtitle}>
          {sale.invoiceType === 'boleta' ? 'BOLETA DE VENTA' : 'FACTURA'} #{sale.id}
        </Text>
        <Text>Fecha: {new Date(sale.date).toLocaleDateString()}</Text>
      </View>

      <View>
        <Text style={styles.subtitle}>Cliente:</Text>
        <Text>{sale.customer.name}</Text>
        <Text>{sale.customer.email}</Text>
        {sale.customer.ruc && <Text>RUC: {sale.customer.ruc}</Text>}
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Producto</Text>
          <Text style={styles.tableCell}>Cantidad</Text>
          <Text style={styles.tableCell}>Precio</Text>
          <Text style={styles.tableCell}>Subtotal</Text>
        </View>

        {sale.items.map((item: any, index: number) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.productName}</Text>
            <Text style={styles.tableCell}>{item.quantity}</Text>
            <Text style={styles.tableCell}>${item.price.toFixed(2)}</Text>
            <Text style={styles.tableCell}>${item.subtotal.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.total}>
        <Text>Subtotal: ${sale.subtotal.toFixed(2)}</Text>
        <Text>IGV (18%): ${sale.tax.toFixed(2)}</Text>
        <Text style={{ fontWeight: 'bold' }}>Total: ${sale.total.toFixed(2)}</Text>
      </View>
    </Page>
  </Document>
);