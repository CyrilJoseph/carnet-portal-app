import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { BasicDetail } from '../models/service-provider/basic-detail';
import { HttpClient } from '@angular/common/http';
import { Contact } from '../models/service-provider/contact';
import { UserService } from './user.service';
import { environment } from '../../../environments/environment';
import { CarnetSequence } from '../models/service-provider/carnet-sequence';
import { CounterfoilFee } from '../models/service-provider/counterfoil-fee';
import { ContinuationSheetFee } from '../models/service-provider/continuation-sheet-fee';
import { ExpeditedFee } from '../models/service-provider/expedited-fee';
import { SecurityDeposit } from '../models/service-provider/security-deposit';

@Injectable({
  providedIn: 'root'
})
export class ServiceProviderService {
  private apiUrl = environment.apiUrl;
  private apiDb = environment.apiDb;

  constructor(private http: HttpClient, private userService: UserService) { }

  getBasicDetailsById(id: number): BasicDetail | any {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiDb}/GetSelectedServiceprovider?p_spid=${id}`).pipe(
      map(response => this.mapToBasicDetail(response)));
  }

  private mapToBasicDetail(basicDetails: any): BasicDetail {
    return {
      spid: basicDetails.SPID,
      companyName: basicDetails.NAMEOF,
      lookupCode: basicDetails.LOOKUPCODE,
      address1: basicDetails.ADDRESS1,
      address2: basicDetails.ADDRESS2,
      city: basicDetails.CITY,
      state: basicDetails.STATE,
      country: basicDetails.COUNTRY,
      issuingRegion: basicDetails.ISSUINGREGION,
      replacementRegion: basicDetails.REPLACEMENTREGION,
      zip: basicDetails.ZIP,
      cargoSurety: basicDetails.cargoSurety,
      cargoPolicyNo: basicDetails.cargoPolicyNo,
      bondSurety: basicDetails.bondSurety
    };
  }

  createBasicDetails(data: BasicDetail): Observable<any> {

    const basicDetails = {
      p_name: data.companyName,
      p_lookupcode: data.lookupCode,
      p_address1: data.address1,
      p_address2: data.address2,
      p_city: data.city,
      p_state: data.state,
      p_zip: data.zip,
      p_country: data.country,
      p_issuingregion: data.issuingRegion,
      p_replacementregion: data.replacementRegion,
      p_bondsurety: null,
      p_cargopolicyno: null,
      p_cargosurety: null,
      p_user_id: this.userService.getUser(),
    }

    return this.http.post(`${this.apiUrl}/${this.apiDb}/InsertNewServiceProvider`, basicDetails);
  }

  updateBasicDetails(id: number, data: BasicDetail): Observable<any> {

    const basicDetails = {
      p_spid: id,
      p_name: data.companyName,
      p_lookupcode: data.lookupCode,
      p_address1: data.address1,
      p_address2: data.address2,
      p_city: data.city,
      p_state: data.state,
      p_zip: data.zip,
      p_country: data.country,
      p_issuingregion: data.issuingRegion,
      p_replacementregion: data.replacementRegion,
      // p_bondsurety: data.bondSurety,
      // p_cargopolicyno: data.cargoPolicyNo,
      // p_cargosurety: data.cargoSurety,
      p_user_id: this.userService.getUser(),
    }

    return this.http.put(`${this.apiUrl}/${this.apiDb}/UpdateServiceProvider`, basicDetails);
  }

  getContactsById(id: number): Observable<Contact[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiDb}/GetSPAllContacts?p_SPid=${id}`).pipe(
      map(response => this.mapToContacts(response)));
  }

  private mapToContacts(data: any[]): Contact[] {
    return data.map(contact => ({
      spContactId: contact.SPCONTACTID,
      serviceProviderId: contact.SPID,
      defaultContact: contact.DEFCONTACTFLAG === 'Y',
      firstName: contact.FIRSTNAME,
      lastName: contact.LASTNAME,
      title: contact.TITLE,
      phone: contact.PHONENO,
      mobile: contact.MOBILENO,
      fax: contact.FAXNO || null,
      email: contact.EMAILADDRESS,
      middleInitial: contact.MIDDLEINITIAL || null
    }));
  }

  createContact(spid: number, data: Contact): Observable<any> {

    const contact = {
      p_spid: spid,
      p_defcontactflag: data.defaultContact ? 'Y' : 'N',
      p_firstname: data.firstName,
      p_lastname: data.lastName,
      P_MIDDLEINITIAL: data.middleInitial,
      p_title: data.title,
      p_phoneno: data.phone,
      p_mobileno: data.mobile,
      p_faxno: data.fax,
      p_emailaddress: data.email,
      p_user_id: this.userService.getUser()
    }

    return this.http.post(`${this.apiUrl}/${this.apiDb}/InsertSPContacts`, contact);
  }

  updateContact(spContactId: number, data: Contact): Observable<any> {

    const contact = {
      p_spcontactid: spContactId,
      //p_defcontactflag: data.defaultContact ? 'Y' : 'N',
      p_firstname: data.firstName,
      p_lastname: data.lastName,
      P_MIDDLEINITIAL: data.middleInitial,
      p_title: data.title,
      p_phoneno: data.phone,
      p_mobileno: data.mobile,
      p_faxno: data.fax,
      p_emailaddress: data.email,
      p_user_id: this.userService.getUser()
    }

    return this.http.put(`${this.apiUrl}/${this.apiDb}/UpdateSPContacts`, contact);
  }

  deleteContact(spContactId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiDb}/InactivateSPContact/${spContactId}`, null);
  }

  getCarnetSequenceById(id: number): Observable<CarnetSequence[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiDb}/GetCarnetSequence?p_spid=${id}`).pipe(
      map(response => this.mapToCarnetSequence(response)));
  }

  private mapToCarnetSequence(data: any[]): CarnetSequence[] {
    return data.map(item => ({
      spid: item.SPID,
      region: item.REGIONID,
      carnetType: item.CARNETTYPE,
      startNumber: item.STARTNUMBER,
      endNumber: item.ENDNUMBER,
      lastNumber: item.LASTNUMBER
    }));
  }

  createCarnetSequence(data: CarnetSequence): Observable<any> {

    const carnetSequence = {
      p_spid: data.spid,
      p_regionid: data.region,
      p_startnumber: data.startNumber,
      p_endnumber: data.endNumber,
      p_carnettype: data.carnetType
    }

    return this.http.post(`${this.apiUrl}/${this.apiDb}/CreateCarnetSequence`, carnetSequence);
  }

  getCounterfoils(spid: number): Observable<CounterfoilFee[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiDb}/GetCfFeeRates?p_spid=${spid}`).pipe(
      map(response => this.mapToCounterFoilFee(response)));
  }

  private mapToCounterFoilFee(data: any[]): CounterfoilFee[] {
    return data.map(item => ({
      cfFeeSetupId: item.P_CFFEESETUPID,
      spid: item.SPID,
      startSets: item.STARTSETS,
      endSets: item.ENDSETS,
      customerType: item.CUSTOMERTYPE,
      carnetType: item.CARNETTYPE,
      effectiveDate: item.EFFDATE,
      rate: item.RATE,
    }));
  }

  addCounterfoil(spid: number, data: CounterfoilFee): Observable<any> {

    const counterfoilFee = {
      P_SPID: spid,
      P_STARTSETS: data.startSets,
      P_ENDSETS: data.endSets,
      P_EFFDATE: data.effectiveDate,
      P_CUSTOMERTYPE: data.customerType,
      P_CARNETTYPE: data.carnetType,
      P_RATE: data.rate,
      P_USERID: this.userService.getUser()
    }

    return this.http.post<any>(`${this.apiUrl}/${this.apiDb}/CreateCfFee`, counterfoilFee);
  }

  updateCounterfoil(id: number, data: CounterfoilFee): Observable<any> {

    const counterfoilFee = {
      P_CFFEESETUPID: id,
      P_EFFDATE: data.effectiveDate,
      P_RATE: data.rate,
      P_USERID: this.userService.getUser()
    }

    return this.http.put<any>(`${this.apiUrl}/${this.apiDb}//UpdateCfFee`, counterfoilFee);
  }

  // deleteCounterfoil(id: string): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${this.apiDb}/InactivateSPContact/${id}`);
  // }

  getContinuationSheets(spid: number): Observable<ContinuationSheetFee[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiDb}/GetCsFeeRates?p_spid=${spid}`).pipe(
      map(response => this.mapToContinuationSheetFee(response)));
  }

  private mapToContinuationSheetFee(data: any[]): ContinuationSheetFee[] {
    return data.map(item => ({
      csFeeSetupId: item.P_CSFEESETUPID,
      spid: item.SPID,
      customerType: item.CUSTOMERTYPE,
      carnetType: item.CARNETTYPE,
      effectiveDate: item.EFFDATE,
      rate: item.RATE,
    }));
  }

  addContinuationSheet(spid: number, data: ContinuationSheetFee): Observable<any> {

    const continuationSheet = {
      P_SPID: spid,
      P_EFFDATE: data.effectiveDate,
      P_CUSTOMERTYPE: data.customerType,
      P_CARNETTYPE: data.carnetType,
      P_RATE: data.rate,
      P_USERID: this.userService.getUser()
    }

    return this.http.post<any>(`${this.apiUrl}/${this.apiDb}/CreateCsFee`, continuationSheet);
  }

  updateContinuationSheet(id: number, data: ContinuationSheetFee): Observable<any> {

    const continuationSheet = {
      P_CSFEESETUPID: id,
      P_EFFDATE: data.effectiveDate,
      P_RATE: data.rate,
      P_USERID: this.userService.getUser()
    }

    return this.http.put<any>(`${this.apiUrl}/${this.apiDb}/UpdateCsFee`, continuationSheet);
  }

  // deleteContinuationSheet(id: string): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${this.apiDb}/InactivateSPContact/${id}`);
  // }

  getExpeditedFees(spid: number): Observable<ExpeditedFee[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiDb}/GetEfFeeRates?p_spid=${spid}`).pipe(
      map(response => this.mapToExpeditedFee(response)));
  }

  private mapToExpeditedFee(data: any[]): ExpeditedFee[] {
    return data.map(item => ({
      expeditedFeeId: item.P_EFFEESETUPID,
      customerType: item.CUSTOMERTYPE,
      deliveryType: item.DELIVERYTYPE,
      startTime: item.STARTTIME,
      endTime: item.ENDTIME,
      timeZone: item.TIMEZONE,
      fee: item.FEES,
      effectiveDate: item.EFFDATE,
      spid: item.SPID
    }));
  }

  createExpeditedFee(spid: number, data: ExpeditedFee): Observable<any> {

    const expeditedFee = {
      P_SPID: spid,
      P_EFFDATE: data.effectiveDate,
      P_CUSTOMERTYPE: data.customerType,
      P_DELIVERYTYPE: data.deliveryType,
      P_TIMEZONE: data.timeZone,
      P_STARTTIME: data.startTime,
      P_ENDTIME: data.endTime,
      P_FEES: data.fee,
      P_USERID: this.userService.getUser()
    }

    return this.http.post<any>(`${this.apiUrl}/${this.apiDb}/CreateEfFee`, expeditedFee);
  }

  updateExpeditedFee(id: number, data: ExpeditedFee): Observable<any> {

    const expeditedFee = {
      P_EFFEESETUPID: id,
      P_EFFDATE: data.effectiveDate,
      P_FEES: data.fee,
      P_USERID: this.userService.getUser()
    }

    return this.http.put<any>(`${this.apiUrl}/${this.apiDb}//UpdateEfFee`, expeditedFee);
  }

  // deleteExpeditedFee(id: string): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${this.apiDb}/InactivateSPContact/${id}`);
  // }

  getSecurityDeposits(spid: number): Observable<SecurityDeposit[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiDb}/GetSPAllContacts?p_spid=${spid}`).pipe(
      map(response => this.mapToSecurityDeposit(response)));
  }

  private mapToSecurityDeposit(data: any[]): SecurityDeposit[] {
    return data.map(item => ({
      securityDepositId: item.P_BONDRATESETUPID,
      holderType: item.HOLDERTYPE,
      uscibMember: item.USCIBMEMBERFLAG,
      specialCommodity: item.SPCLCOMMODITY,
      specialCountry: item.SPCLCOUNTRY,
      rate: item.RATE,
      effectiveDate: item.EFFDATE,
      spid: item.SPID
    }));
  }

  createSecurityDeposit(spid: number, data: SecurityDeposit): Observable<any> {

    const securityDeposit = {
      P_SPID: spid,
      P_EFFDATE: data.effectiveDate,
      P_HOLDERTYPE: data.holderType,
      P_USCIBMEMBERFLAG: data.uscibMember,
      P_SPCLCOMMODITY: data.specialCommodity,
      P_SPCLCOUNTRY: data.specialCountry,
      P_RATE: data.rate,
      P_USERID: this.userService.getUser()
    }

    return this.http.post<any>(`${this.apiUrl}/${this.apiDb}/CreateBondRate`, securityDeposit);
  }

  updateSecurityDeposit(id: number, data: SecurityDeposit): Observable<any> {

    const securityDeposit = {
      P_BONDRATESETUPID: id,
      P_EFFDATE: data.effectiveDate,
      P_RATE: data.rate,
      P_USERID: this.userService.getUser()
    }

    return this.http.put<any>(`${this.apiUrl}/${this.apiDb}/UpdateBondRate`, securityDeposit);
  }

  // deleteSecurityDeposit(id: string): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${this.apiDb}/InactivateSPContact/${id}`);
  // }
}
