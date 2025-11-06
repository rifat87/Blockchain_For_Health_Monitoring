// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title VitalsRegistry - Store latest vital signs per patient
/// @notice Each patientId maps to exactly one current record (no arrays)
contract VitalsRegistry {
    struct VitalsSnapshot {
        uint16 heartRate;        // bpm
        uint16 respirationRate;  // breaths per minute
        uint16 systolic;         // mmHg
        uint16 diastolic;        // mmHg
        uint16 bodyTempX10;      // Celsius * 10 (e.g., 36.8 → 368)
        uint16 spo2;             // oxygen saturation %
        address submittedBy;     // wallet who sent TX
    }

    // patientId → latest vitals
    mapping(bytes32 => VitalsSnapshot) private snapshots;

    event SnapshotStored(
        bytes32 indexed patientId,
        uint16 heartRate,
        uint16 respirationRate,
        uint16 systolic,
        uint16 diastolic,
        uint16 bodyTempX10,
        uint16 spo2,
        address submittedBy
    );

    /// @notice Store or update latest vitals for a patient
    function storeVitals(
        bytes32 patientId,
        uint16 heartRate,
        uint16 respirationRate,
        uint16 systolic,
        uint16 diastolic,
        uint16 bodyTempX10,
        uint16 spo2
    ) external {
        snapshots[patientId] = VitalsSnapshot({
            heartRate: heartRate,
            respirationRate: respirationRate,
            systolic: systolic,
            diastolic: diastolic,
            bodyTempX10: bodyTempX10,
            spo2: spo2,
            submittedBy: msg.sender
        });

        emit SnapshotStored(
            patientId,
            heartRate,
            respirationRate,
            systolic,
            diastolic,
            bodyTempX10,
            spo2,
            msg.sender
        );
    }

    /// @notice Retrieve the latest vitals for a patient by ID
    function getSnapshot(bytes32 patientId)
        external
        view
        returns (VitalsSnapshot memory)
    {
        VitalsSnapshot memory snap = snapshots[patientId];
        require(snap.submittedBy != address(0), "No data for this patient");
        return snap;
    }
}
