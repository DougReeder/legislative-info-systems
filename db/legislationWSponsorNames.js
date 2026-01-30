function legislationWSponsorNames(legislationAll, legislators) {
  return legislationAll.data().map(item => {
    const sponsorObjs = item.sponsors?.map?.(sponsorId => legislators.findOne({$loki: {$eq: sponsorId}}));
    const sponsorText = (sponsorObjs?.map(sponsor => sponsor?.firstName + " " + sponsor?.lastName).join(", ")) ?? "";
    return {...item, sponsorText};
  });
}

export default legislationWSponsorNames;
